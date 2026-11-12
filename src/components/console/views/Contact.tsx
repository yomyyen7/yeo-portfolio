"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { PageHead, Panel } from "../ui";

export default function Contact() {
  const { c, tr } = useI18n();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible : le lien mailto reste utilisable */
    }
  }

  return (
    <>
      <PageHead
        title="Contact"
        lead={tr(
          "Pour un stage, un projet ou une question, le plus simple est de m'écrire. Je réponds sous quelques jours.",
          "For an internship, a project or a question, the easiest way is to email me. I reply within a few days."
        )}
      />
      <div className="grid contact-grid">
        <Panel title={tr("Coordonnées", "Details")}>
          <dl className="facts">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${profile.email}`} className="link">
                  {profile.email}
                </a>{" "}
                <button type="button" className="ghost sm" onClick={copy}>
                  {copied ? tr("Copié", "Copied") : tr("Copier", "Copy")}
                </button>
              </dd>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                  {profile.linkedinLabel}
                </a>
              </dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link">
                  github.com/{profile.githubUser}
                </a>
              </dd>
            </div>
            <div>
              <dt>{tr("Lieu", "Location")}</dt>
              <dd>{c.location}</dd>
            </div>
            <div>
              <dt>{tr("Disponibilité", "Availability")}</dt>
              <dd>
                <i className="dot ok" /> {c.availability}
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel title={tr("Écrire un message", "Write a message")} className="span-2">
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailto;
            }}
          >
            <label>
              <span>{tr("Objet", "Subject")}</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={tr("Proposition de stage", "Internship offer")} />
            </label>
            <label>
              <span>Message</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder={tr(`Bonjour ${profile.firstName}…`, `Hello ${profile.firstName}…`)} />
            </label>
            <div className="actions">
              <button className="btn primary" type="submit">
                {tr("Ouvrir dans ma messagerie", "Open in my mail app")}
              </button>
              <span className="note">{tr("Le message s'ouvre dans votre application d'e-mail ; rien n'est envoyé depuis ce site.", "The message opens in your email app; nothing is sent from this site.")}</span>
            </div>
          </form>
        </Panel>
      </div>
    </>
  );
}

