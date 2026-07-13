"use client";

import { STAGE_LABEL } from "@/lib/format";
import type { ClassifyResponse } from "@/types";

type Props = {
  message: string;
  onMessageChange: (value: string) => void;
  onClassify: () => void;
  classifying: boolean;
  classification: ClassifyResponse | null;
  error: string | null;
};

export function ClassifyPanel({
  message,
  onMessageChange,
  onClassify,
  classifying,
  classification,
  error,
}: Props) {
  return (
    <section className="panel classify" aria-labelledby="classify-title">
      <h2 id="classify-title">Heurística de priorização (não é IA)</h2>
      <p className="muted">
        Regras transparentes por intenção, canal e silêncio — para priorizar
        retorno humano sem scraping do WhatsApp. Não é LLM, não é modelo
        preditivo de crédito e não decide automaticamente sobre pessoas.
      </p>
      <label className="sr-only" htmlFor="lead-message">
        Mensagem do lead
      </label>
      <textarea
        id="lead-message"
        value={message}
        onChange={(event) => onMessageChange(event.target.value)}
        aria-label="Mensagem do lead"
      />
      <button type="button" onClick={onClassify} disabled={classifying || !message.trim()}>
        {classifying ? "Aplicando regras…" : "Priorizar mensagem"}
      </button>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      {classification ? (
        <div className="classify-result">
          <div className="lead-top">
            <span
              className={`badge ${classification.temperature === "hot" ? "hot" : "warn"}`}
            >
              {classification.temperature}
            </span>
            <strong>score {classification.opportunity_score}</strong>
          </div>
          <p className="muted">
            Estágio sugerido: {STAGE_LABEL[classification.suggested_stage]}
          </p>
          <p className="muted">{classification.next_action}</p>
          <ul className="highlights">
            {classification.rationale.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
