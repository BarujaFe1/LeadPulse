import { money, STAGE_LABEL } from "@/lib/format";
import type { Lead } from "@/types";

type Props = { leads: Lead[] };

export function RiskLeads({ leads }: Props) {
  return (
    <section className="panel" aria-labelledby="risk-title">
      <h2 id="risk-title">Leads em risco</h2>
      {leads.length === 0 ? (
        <p className="muted empty-state">Nenhum lead em risco no snapshot.</p>
      ) : (
        leads.map((lead) => (
          <div className="lead-row" key={lead.id}>
            <div className="lead-top">
              <strong>{lead.name}</strong>
              <span
                className={`badge ${lead.temperature === "hot" ? "hot" : "warn"}`}
              >
                score {lead.opportunity_score}
              </span>
            </div>
            <div className="muted">
              {lead.channel} · {STAGE_LABEL[lead.stage]} ·{" "}
              {money(lead.estimated_revenue)}
            </div>
            <div className="muted">{lead.notes}</div>
          </div>
        ))
      )}
    </section>
  );
}
