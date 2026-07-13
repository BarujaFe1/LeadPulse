/**
 * Honest scoring card — rule-based heuristic, not ML/LLM.
 */
export function ScoringMethodology() {
  return (
    <section className="panel methodology" aria-labelledby="scoring-title">
      <h2 id="scoring-title">Como o opportunity score funciona</h2>
      <p className="muted">
        O score (0–100) é uma <strong>heurística determinística</strong> para
        priorizar atendimento humano. Não é modelo de machine learning, não é
        LLM e não decide crédito, contratação ou aprovação automática de
        pessoas.
      </p>
      <ol className="method-list">
        <li>
          <strong>Base 40</strong> — ponto de partida neutro.
        </li>
        <li>
          <strong>+25</strong> — termos de intenção (ex.: “quero fechar”,
          “orçamento”, “hoje”).
        </li>
        <li>
          <strong>−15</strong> — baixa urgência (“só pesquisando”, “depois”).
        </li>
        <li>
          <strong>Cap ≤25</strong> — sinais de perda (“já fechei”,
          “concorrente”).
        </li>
        <li>
          <strong>+10</strong> — silêncio ≥24h (risco de esquecimento).
        </li>
        <li>
          <strong>+5</strong> — canal WhatsApp/Instagram (SLA de resposta
          costuma ser crítico).
        </li>
      </ol>
      <p className="muted">
        A saída inclui temperatura, estágio sugerido, próxima ação e
        <em> rationale</em> legível. Em leads “hot”, silêncio eleva urgência no
        score, mas a ação recomendada permanece “responder rápido”.
      </p>
    </section>
  );
}
