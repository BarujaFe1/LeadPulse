"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { classifyMessage, fetchDemo } from "@/lib/api";
import type { ClassifyResponse, DashboardSummary } from "@/types";

const STAGE_LABEL: Record<string, string> = {
  new: "Novo",
  contacted: "Contatado",
  qualified: "Qualificado",
  proposal: "Proposta",
  won: "Ganho",
  lost: "Perdido",
};

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default function HomePage() {
  const [demo, setDemo] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Oi, vi o anúncio. Quero fechar hoje — pode me passar o orçamento pelo WhatsApp?",
  );
  const [classification, setClassification] = useState<ClassifyResponse | null>(
    null,
  );
  const [classifying, setClassifying] = useState(false);

  useEffect(() => {
    fetchDemo()
      .then(setDemo)
      .catch((err: Error) => setError(err.message));
  }, []);

  const funnelMax = useMemo(() => {
    if (!demo) return 1;
    return Math.max(...demo.funnel.map((f) => f.count), 1);
  }, [demo]);

  const lostChart = useMemo(
    () =>
      (demo?.lost_reasons ?? []).map((r) => ({
        reason: r.reason.replaceAll("_", " "),
        count: r.count,
        revenue: r.revenue_impact,
      })),
    [demo],
  );

  async function onClassify() {
    setClassifying(true);
    setError(null);
    try {
      const result = await classifyMessage({
        message,
        channel: "whatsapp",
        hours_since_last_touch: 26,
      });
      setClassification(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha na classificação");
    } finally {
      setClassifying(false);
    }
  }

  return (
    <main>
      <header className="hero">
        <div className="brand">LeadPulse</div>
        <h1>Cockpit de follow-up para quem vende no WhatsApp</h1>
        <p>
          Transforme conversas soltas em funil, tempo de resposta, leads
          esquecidos e tarefas priorizadas — sem virar um CRM corporativo
          pesado.
        </p>
      </header>

      {error ? <p className="error">{error}</p> : null}

      {!demo ? (
        <p className="muted">Carregando radar comercial…</p>
      ) : (
        <>
          <section className="grid kpi-grid">
            <div className="panel">
              <div className="kpi-value">{demo.kpis.forgotten_leads}</div>
              <div className="kpi-label">Leads esquecidos</div>
            </div>
            <div className="panel">
              <div className="kpi-value">
                {demo.kpis.median_first_response_minutes.toFixed(0)}m
              </div>
              <div className="kpi-label">Mediana 1ª resposta</div>
            </div>
            <div className="panel">
              <div className="kpi-value">{demo.kpis.hot_leads}</div>
              <div className="kpi-label">Leads quentes</div>
            </div>
            <div className="panel">
              <div className="kpi-value">
                {money(demo.kpis.at_risk_revenue)}
              </div>
              <div className="kpi-label">Receita em risco</div>
            </div>
            <div className="panel">
              <div className="kpi-value">{demo.conversion_rate}%</div>
              <div className="kpi-label">Conversão demo</div>
            </div>
            <div className="panel">
              <div className="kpi-value">{demo.kpis.open_follow_ups}</div>
              <div className="kpi-label">Follow-ups abertos</div>
            </div>
          </section>

          <section className="grid two-col" style={{ marginBottom: "1rem" }}>
            <div className="panel">
              <h2>Radar de follow-up</h2>
              {demo.follow_ups.map((task) => (
                <div className="task-row" key={task.id}>
                  <div className="task-top">
                    <strong>{task.lead_name}</strong>
                    <span
                      className={`badge ${
                        task.priority === "critical"
                          ? "danger"
                          : task.priority === "high"
                            ? "hot"
                            : "warn"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="muted">{task.title}</div>
                  <div className="muted">Due: {task.due_at.replace("T", " ")}</div>
                </div>
              ))}
            </div>

            <div className="panel">
              <h2>Funil simples</h2>
              <div className="funnel">
                {demo.funnel.map((stage) => (
                  <div className="funnel-bar" key={stage.stage}>
                    <span>{STAGE_LABEL[stage.stage] ?? stage.stage}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(stage.count / funnelMax) * 100}%`,
                        }}
                      />
                    </div>
                    <strong>{stage.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid two-col" style={{ marginBottom: "1rem" }}>
            <div className="panel">
              <h2>Leads em risco</h2>
              {demo.top_risk_leads.map((lead) => (
                <div className="lead-row" key={lead.id}>
                  <div className="lead-top">
                    <strong>{lead.name}</strong>
                    <span className={`badge ${lead.temperature === "hot" ? "hot" : "warn"}`}>
                      score {lead.opportunity_score}
                    </span>
                  </div>
                  <div className="muted">
                    {lead.channel} · {STAGE_LABEL[lead.stage]} ·{" "}
                    {money(lead.estimated_revenue)}
                  </div>
                  <div className="muted">{lead.notes}</div>
                </div>
              ))}
            </div>

            <div className="panel">
              <h2>Motivos de perda</h2>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lostChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3a55" />
                    <XAxis dataKey="reason" stroke="#93a4c3" fontSize={12} />
                    <YAxis stroke="#93a4c3" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#121a2b",
                        border: "1px solid #2a3a55",
                      }}
                    />
                    <Bar dataKey="count" fill="#3dd6c6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="grid two-col">
            <div className="panel">
              <h2>Relatório semanal</h2>
              <ul className="highlights">
                {demo.weekly_highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="panel classify">
              <h2>Classificação leve de oportunidade</h2>
              <p className="muted">
                Heurística transparente por intenção, canal e silêncio — útil
                para priorizar sem depender de scraping do WhatsApp.
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-label="Mensagem do lead"
              />
              <button type="button" onClick={onClassify} disabled={classifying}>
                {classifying ? "Classificando…" : "Classificar mensagem"}
              </button>
              {classification ? (
                <div>
                  <div className="lead-top">
                    <span className={`badge ${classification.temperature === "hot" ? "hot" : "warn"}`}>
                      {classification.temperature}
                    </span>
                    <strong>score {classification.opportunity_score}</strong>
                  </div>
                  <p className="muted">
                    Estágio sugerido:{" "}
                    {STAGE_LABEL[classification.suggested_stage]}
                  </p>
                  <p className="muted">{classification.next_action}</p>
                  <ul className="highlights">
                    {classification.rationale.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
