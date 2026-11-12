import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, localAnswer } from "@/lib/assistant";
import type { Lang } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 60;

// Modèle par défaut ; se change sans toucher au code avec la variable CHAT_MODEL
// (par exemple claude-haiku-5-5 pour réduire le coût).
const MODEL = process.env.CHAT_MODEL || "claude-opus-5-5";
// Modèles pour lesquels le repli automatique côté serveur en cas de refus est disponible.
const SERVER_FALLBACK = new Set(["claude-opus-5-5", "claude-sonnet-5-5", "claude-fable-5-2"]);

// Garde-fous d'un point d'accès public : la conversation reste courte et peu coûteuse.
const MAX_MESSAGES = 12;
const MAX_CHARS = 800;
const MAX_TOKENS = 4000;
const PER_MINUTE = 10;
const PER_DAY = 80;

const SYSTEM = buildSystemPrompt();

// Limite de débit en mémoire, par adresse IP. Elle vaut par instance de fonction :
// c'est un frein contre l'abus, pas une garantie stricte.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 86_400_000);
  const lastMinute = recent.filter((t) => now - t < 60_000).length;
  if (lastMinute >= PER_MINUTE || recent.length >= PER_DAY) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

type Turn = { role: "user" | "assistant"; content: string };

function parse(body: unknown): { messages: Turn[]; lang: Lang } | null {
  if (!body || typeof body !== "object") return null;
  const { messages, lang } = body as { messages?: unknown; lang?: unknown };
  if (!Array.isArray(messages)) return null;
  const turns: Turn[] = [];
  for (const m of messages.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) turns.push({ role, content: text });
  }
  // L'API attend une conversation qui commence et se termine par un message du visiteur.
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return { messages: turns, lang: lang === "en" ? "en" : "fr" };
}

/** Diffuse la réponse du modèle morceau par morceau. */
async function* askClaude(client: Anthropic, messages: Turn[], withFallback: boolean): AsyncGenerator<string> {
  const base = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    output_config: { effort: "low" as const },
    system: [{ type: "text" as const, text: SYSTEM, cache_control: { type: "ephemeral" as const } }],
    messages,
  };

  if (withFallback) {
    // En cas de refus par un filtre de sécurité, l'API relance la requête sur un modèle de repli.
    const stream = client.beta.messages.stream({
      ...base,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") yield event.delta.text;
    }
    return;
  }

  const stream = client.messages.stream(base);
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") yield event.delta.text;
  }
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();

  let parsed: ReturnType<typeof parse> = null;
  try {
    parsed = parse(await req.json());
  } catch {
    parsed = null;
  }
  if (!parsed) return Response.json({ error: "invalid_request" }, { status: 400 });
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const { messages, lang } = parsed;
  const question = messages[messages.length - 1].content;
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Assistant-Mode": hasKey ? "ai" : "local",
  };

  // Sans clé d'API : réponses locales, par mots-clés.
  if (!hasKey) return new Response(localAnswer(question, lang), { headers });

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      const pipe = async (withFallback: boolean) => {
        for await (const chunk of askClaude(client, messages, withFallback)) {
          sent = true;
          controller.enqueue(encoder.encode(chunk));
        }
      };

      try {
        try {
          await pipe(SERVER_FALLBACK.has(MODEL));
        } catch (error) {
          // Si l'option de repli est refusée par l'API, on réessaie une fois sans elle.
          if (!sent && error instanceof Anthropic.BadRequestError && SERVER_FALLBACK.has(MODEL)) await pipe(false);
          else throw error;
        }
        // Réponse vide (refus, par exemple) : on répond tout de même au visiteur.
        if (!sent) controller.enqueue(encoder.encode(localAnswer(question, lang)));
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) console.error("[chat] quota de l'API atteint");
        else if (error instanceof Anthropic.AuthenticationError) console.error("[chat] clé d'API invalide");
        else if (error instanceof Anthropic.APIError) console.error(`[chat] erreur API ${error.status}: ${error.message}`);
        else console.error("[chat] erreur inattendue", error);
        // Rien n'a encore été envoyé : le visiteur reçoit la réponse locale plutôt qu'une erreur.
        if (!sent) controller.enqueue(encoder.encode(localAnswer(question, lang)));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, { headers });
}
