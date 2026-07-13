import { money } from "@/lib/format";
import type { ResponseKpi } from "@/types";

type Props = {
  kpis: ResponseKpi;
  conversionRate: number;
};

export function KpiGrid({ kpis, conversionRate }: Props) {
  const items = [
    {
      value: String(kpis.forgotten_leads),
      label: "Leads esquecidos",
      hint: "Ativos sem 1ª resposta ou sem toque há 24h+",
    },
    {
      value: `${kpis.median_first_response_minutes.toFixed(0)}m`,
      label: "Mediana 1ª resposta",
      hint: "Snapshot demo — não SLA de produção",
    },
    {
      value: String(kpis.hot_leads),
      label: "Leads quentes",
      hint: "Temperatura hot no funil ativo",
    },
    {
      value: money(kpis.at_risk_revenue),
      label: "Receita em risco",
      hint: "Soma da receita estimada dos esquecidos",
    },
    {
      value: `${conversionRate}%`,
      label: "Conversão demo",
      hint: "Won / (won + lost) no seed sintético",
    },
    {
      value: String(kpis.open_follow_ups),
      label: "Follow-ups abertos",
      hint: "Tarefas geradas a partir do radar",
    },
  ];

  return (
    <section className="grid kpi-grid" aria-label="Indicadores do lab">
      {items.map((item) => (
        <article className="panel kpi-card" key={item.label} title={item.hint}>
          <div className="kpi-value">{item.value}</div>
          <div className="kpi-label">{item.label}</div>
        </article>
      ))}
    </section>
  );
}
