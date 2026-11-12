"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { splitMarkers } from "@/lib/assistant";
import { useI18n } from "./i18n";
import type { AppId } from "./icons";

type Msg = { id: number; role: "user" | "assistant"; text: string; pending?: boolean };

// Reconnaissance vocale du navigateur : API non standardisée, typée ici au minimum nécessaire.
type SpeechResult = ArrayLike<{ transcript: string }> & { isFinal: boolean };
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<SpeechResult> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecognitionCtor = new () => Recognition;

function getRecognition(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function Assistant({ openApp }: { openApp: (id: AppId) => void }) {
  const { lang, tr } = useI18n();
  const first = profile.firstName;
  const nextId = useRef(1);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"ai" | "local" | null>(null);
  const [speak, setSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const [canListen, setCanListen] = useState(false);
  const recRef = useRef<Recognition | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const speechLang = lang === "fr" ? "fr-FR" : "en-US";

  useEffect(() => {
    setCanListen(Boolean(getRecognition()));
    return () => {
      recRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const say = useCallback(
    (text: string) => {
      const synth = window.speechSynthesis;
      if (!synth || !text) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = speechLang;
      const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
      if (voice) u.voice = voice;
      synth.speak(u);
    },
    [lang, speechLang]
  );

  const send = useCallback(
    async (raw: string, aloud: boolean) => {
      const text = raw.trim();
      if (!text || busy) return;
      window.speechSynthesis?.cancel();
      setValue("");
      setBusy(true);

      const userMsg: Msg = { id: nextId.current++, role: "user", text };
      const replyId = nextId.current++;
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.text }));
      setMessages((ms) => [...ms, userMsg, { id: replyId, role: "assistant", text: "", pending: true }]);

      const setReply = (reply: string, pending: boolean) =>
        setMessages((ms) => ms.map((m) => (m.id === replyId ? { ...m, text: reply, pending } : m)));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, lang }),
        });

        if (res.status === 429) {
          setReply(
            tr(
              "Beaucoup de questions d'un coup ! Réessayez dans une minute.",
              "That is a lot of questions at once! Please try again in a minute."
            ),
            false
          );
          return;
        }
        if (!res.ok || !res.body) throw new Error(String(res.status));

        setMode(res.headers.get("X-Assistant-Mode") === "ai" ? "ai" : "local");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value: chunk } = await reader.read();
          if (done) break;
          acc += decoder.decode(chunk, { stream: true });
          setReply(splitMarkers(acc).text, true);
        }
        const { text: finalText, open } = splitMarkers(acc);
        setReply(finalText, false);
        if (aloud) say(finalText);
        if (open[0]) {
          // La fenêtre demandée s'ouvre, puis l'assistant repasse devant pour que la réponse reste lisible.
          setTimeout(() => {
            openApp(open[0]);
            setTimeout(() => openApp("assistant"), 80);
          }, 500);
        }
      } catch {
        setReply(
          tr(
            `Je n'arrive pas à répondre pour le moment. Vous pouvez écrire à ${first} : ${profile.email}.`,
            `I cannot answer right now. You can email ${first} at ${profile.email}.`
          ),
          false
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, lang, tr, say, openApp, first]
  );

  function toggleMic() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const Ctor = getRecognition();
    if (!Ctor) return;
    window.speechSynthesis?.cancel();
    const rec = new Ctor();
    rec.lang = speechLang;
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let heard = "";
      for (let i = 0; i < e.results.length; i++) {
        heard += e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText = heard;
      }
      setValue(heard);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      // Une question posée à la voix reçoit une réponse lue à voix haute.
      if (finalText.trim()) send(finalText, true);
    };
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  const suggestions = [
    tr(`Qui est ${first} ?`, `Who is ${first}?`),
    tr("Quels sont ses projets ?", "What has he built?"),
    tr("Quelles technologies maîtrise-t-il ?", "Which technologies does he use?"),
    tr("Comment le contacter ?", "How can I reach him?"),
  ];

  return (
    <div className="chat">
      <div className="chat-log" aria-live="polite">
        <div className="bubble assistant">
          {tr(
            `Bonjour ! Je suis l'assistant de ${first}. Posez-moi vos questions sur son parcours, ses projets ou ses compétences — par écrit ou à la voix.`,
            `Hello! I am ${first}'s assistant. Ask me anything about his background, projects or skills — by typing or by voice.`
          )}
        </div>

        {messages.length === 0 && (
          <div className="chat-suggest">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s, speak)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.role}`}>
            {m.text || (m.pending ? <span className="typing" aria-label={tr("Réponse en cours", "Answering")}><i /><i /><i /></span> : null)}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="chat-foot">
        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(value, speak);
          }}
        >
          {canListen && (
            <button
              type="button"
              className={`chat-icon${listening ? " rec" : ""}`}
              onClick={toggleMic}
              aria-pressed={listening}
              aria-label={listening ? tr("Arrêter l'écoute", "Stop listening") : tr("Parler", "Speak")}
              title={listening ? tr("Arrêter l'écoute", "Stop listening") : tr("Parler", "Speak")}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5.5 11a6.500 6.500 0 0 0 13 0M12 17.500V21" />
              </svg>
            </button>
          )}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={800}
            placeholder={listening ? tr("Je vous écoute…", "Listening…") : tr("Votre question…", "Your question…")}
            aria-label={tr("Votre question", "Your question")}
          />
          <button
            type="button"
            className={`chat-icon${speak ? " on" : ""}`}
            onClick={() => {
              if (speak) window.speechSynthesis?.cancel();
              setSpeak(!speak);
            }}
            aria-pressed={speak}
            aria-label={tr("Lire les réponses à voix haute", "Read answers aloud")}
            title={tr("Lire les réponses à voix haute", "Read answers aloud")}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9.500v5h3.500l4.500 4v-13l-4.500 4z" />
              {speak ? <path d="M15.500 9a4.500 4.500 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11" /> : <path d="M16 9.500l5 5M21 9.500l-5 5" />}
            </svg>
          </button>
          <button type="submit" className="btn primary" disabled={busy || !value.trim()}>
            {tr("Envoyer", "Send")}
          </button>
        </form>
        <p className="chat-note">
          {mode === "local"
            ? tr("Mode démo : réponses préparées, sans modèle d'IA.", "Demo mode: prepared answers, no AI model.")
            : mode === "ai"
              ? tr("Réponses générées par Claude à partir du profil.", "Answers generated by Claude from the profile.")
              : tr("L'assistant peut aussi ouvrir les fenêtres pour vous.", "The assistant can also open windows for you.")}
        </p>
      </div>
    </div>
  );
}
