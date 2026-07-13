import { DEMO_LEADS } from "@/lib/demo-leads";
import type {
  ClassifyResponse,
  DashboardSummary,
  FollowUpTask,
  FunnelStage,
  Lead,
  LostReason,
  ResponseKpi,
  Stage,
} from "@/types";

const ACTIVE_STAGES = new Set<Stage>([
  "new",
  "contacted",
  "qualified",
  "proposal",
]);

/** Fixed demo clock so forgotten-lead rules stay stable in the public lab. */
const NOW = new Date("2026-07-09T12:00:00");

function parseDt(value: string | null | undefined): Date | null {
  if (!value) return null;
  return new Date(value);
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function isForgotten(lead: Lead): boolean {
  if (!ACTIVE_STAGES.has(lead.stage)) return false;
  if (lead.first_response_minutes === null) return true;
  const last = parseDt(lead.last_touch_at);
  if (!last) return true;
  const hours = (NOW.getTime() - last.getTime()) / (1000 * 60 * 60);
  return hours >= 24 && ["new", "contacted", "qualified"].includes(lead.stage);
}

export function buildFollowUps(leads: Lead[] = DEMO_LEADS): FollowUpTask[] {
  const tasks: FollowUpTask[] = [];
  for (const lead of leads) {
    if (!ACTIVE_STAGES.has(lead.stage)) continue;
    let priority: FollowUpTask["priority"] = "medium";
    if (lead.first_response_minutes === null || lead.tags.includes("forgotten")) {
      priority = "critical";
    } else if (lead.temperature === "hot") {
      priority = "high";
    } else if (lead.opportunity_score < 50) {
      priority = "low";
    }
    tasks.push({
      id: `T-${lead.id}`,
      lead_id: lead.id,
      lead_name: lead.name,
      due_at: lead.next_follow_up_at ?? lead.created_at,
      priority,
      title: `Retomar ${lead.name} (${lead.channel})`,
      status: "open",
    });
  }
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return tasks.sort(
    (a, b) => order[a.priority] - order[b.priority] || a.due_at.localeCompare(b.due_at),
  );
}

export function buildDashboard(leads: Lead[] = DEMO_LEADS): DashboardSummary {
  const active = leads.filter((l) => ACTIVE_STAGES.has(l.stage));
  const won = leads.filter((l) => l.stage === "won");
  const lost = leads.filter((l) => l.stage === "lost");
  const responses = leads
    .map((l) => l.first_response_minutes)
    .filter((v): v is number => v !== null);
  const forgotten = active.filter(isForgotten);
  const hot = active.filter((l) => l.temperature === "hot");
  const followUps = buildFollowUps(leads);

  const stageOrder: Stage[] = [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "won",
    "lost",
  ];
  const funnel: FunnelStage[] = stageOrder.map((stage) => {
    const bucket = leads.filter((l) => l.stage === stage);
    return {
      stage,
      count: bucket.length,
      revenue: Math.round(bucket.reduce((s, l) => s + l.estimated_revenue, 0) * 100) / 100,
    };
  });

  const reasonMap = new Map<string, { count: number; revenue: number }>();
  for (const lead of lost) {
    const reason = lead.lost_reason || "nao_informado";
    const prev = reasonMap.get(reason) ?? { count: 0, revenue: 0 };
    reasonMap.set(reason, {
      count: prev.count + 1,
      revenue: prev.revenue + lead.estimated_revenue,
    });
  }
  const lostReasons: LostReason[] = [...reasonMap.entries()]
    .map(([reason, v]) => ({
      reason,
      count: v.count,
      revenue_impact: Math.round(v.revenue * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count);

  const risk = [...active]
    .filter((l) => isForgotten(l) || l.temperature === "hot")
    .sort(
      (a, b) =>
        b.opportunity_score - a.opportunity_score ||
        a.last_touch_at.localeCompare(b.last_touch_at),
    )
    .slice(0, 5);

  const closed = won.length + lost.length;
  const conversion = closed ? Math.round((won.length / closed) * 1000) / 10 : 0;
  const sortedResp = [...responses].sort((a, b) => a - b);
  const p90 = sortedResp.length
    ? sortedResp[Math.floor(0.9 * (sortedResp.length - 1))]
    : 0;

  const kpis: ResponseKpi = {
    median_first_response_minutes: median(responses),
    p90_first_response_minutes: p90,
    unanswered_over_24h: active.filter((l) => l.first_response_minutes === null).length,
    forgotten_leads: forgotten.length,
    open_follow_ups: followUps.length,
    hot_leads: hot.length,
    at_risk_revenue:
      Math.round(forgotten.reduce((s, l) => s + l.estimated_revenue, 0) * 100) / 100,
  };

  return {
    total_leads: leads.length,
    active_leads: active.length,
    won_leads: won.length,
    lost_leads: lost.length,
    conversion_rate: conversion,
    kpis,
    funnel,
    lost_reasons: lostReasons,
    top_risk_leads: risk,
    follow_ups: followUps.slice(0, 8),
    weekly_highlights: buildWeeklyHighlights({
      forgottenCount: forgotten.length,
      atRiskRevenue: kpis.at_risk_revenue,
      medianFirstResponse: kpis.median_first_response_minutes,
      p90FirstResponse: kpis.p90_first_response_minutes,
      conversion,
      wonCount: won.length,
      closedCount: closed,
      topLostReason: lostReasons[0]?.reason ?? null,
    }),
  };
}

function buildWeeklyHighlights(input: {
  forgottenCount: number;
  atRiskRevenue: number;
  medianFirstResponse: number;
  p90FirstResponse: number;
  conversion: number;
  wonCount: number;
  closedCount: number;
  topLostReason: string | null;
}): string[] {
  const highlights = [
    `${input.forgottenCount} leads ativos sem retorno adequado (receita em risco R$ ${input.atRiskRevenue.toLocaleString("pt-BR")}).`,
    `Mediana de 1ª resposta: ${Math.round(input.medianFirstResponse)} min (p90 ${Math.round(input.p90FirstResponse)}).`,
    `Conversão demo: ${input.conversion}% (${input.wonCount} ganhos / ${input.closedCount} encerrados).`,
  ];
  if (input.topLostReason) {
    highlights.push(
      `Maior motivo de perda (demo): ${input.topLostReason.replaceAll("_", " ")}.`,
    );
  } else {
    highlights.push("Nenhum lead perdido no snapshot — foque em SLA de resposta.");
  }
  return highlights;
}

export function classifyMessageClient(payload: {
  message: string;
  channel?: string;
  hours_since_last_touch?: number;
}): ClassifyResponse {
  const text = payload.message.toLowerCase();
  let score = 40;
  const rationale: string[] = [];
  let temperature: ClassifyResponse["temperature"] = "warm";
  let stage: Stage = "contacted";
  let next_action = "Registrar lead e agendar follow-up em 24h.";

  const hotTerms = [
    "quero fechar",
    "hoje",
    "agora",
    "orçamento",
    "preço",
    "agendar",
    "visita",
  ];
  const coldTerms = ["só pesquisando", "depois", "talvez", "não tenho pressa"];
  const lostTerms = ["já fechei", "concorrente", "desisti"];

  const hits = hotTerms.filter((t) => text.includes(t));
  if (hits.length) {
    score += 25;
    rationale.push(`Sinais de intenção: ${hits.join(", ")}.`);
    temperature = "hot";
    stage = "qualified";
    next_action = "Priorizar retorno humano em até 15 minutos.";
  }

  if (coldTerms.some((t) => text.includes(t))) {
    score -= 15;
    temperature = "cold";
    rationale.push("Linguagem de baixa urgência detectada.");
    next_action = "Nutrir com valor e remarcar contato em 3 dias.";
  }

  if (lostTerms.some((t) => text.includes(t))) {
    score = Math.min(score, 25);
    stage = "lost";
    temperature = "cold";
    rationale.push("Indício de perda / fechamento externo.");
    next_action = "Registrar motivo de perda e pedir feedback curto.";
  }

  if ((payload.hours_since_last_touch ?? 0) >= 24) {
    score += 10;
    rationale.push("Lead sem toque há 24h+ — risco de esquecimento.");
    // Do not overwrite a hot-intent action: silence raises urgency, but
    // the recommended next step stays "reply now" when intent is hot.
    if (temperature !== "hot") {
      next_action = "Criar tarefa crítica de follow-up agora.";
    }
  }

  const channel = payload.channel ?? "whatsapp";
  if (channel === "whatsapp" || channel === "instagram") {
    score += 5;
    rationale.push(`Canal ${channel} costuma exigir resposta rápida.`);
  }

  score = Math.max(0, Math.min(100, score));
  if (!rationale.length) {
    rationale.push(
      "Classificação heurística sem sinais fortes — revisar manualmente.",
    );
  }

  return {
    temperature,
    suggested_stage: stage,
    opportunity_score: score,
    rationale,
    next_action,
  };
}
