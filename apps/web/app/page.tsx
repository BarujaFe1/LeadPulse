"use client";

import { useEffect, useState } from "react";
import { ClassifyPanel } from "@/components/ClassifyPanel";
import { DemoSkeleton } from "@/components/DemoSkeleton";
import { FollowUpRadar } from "@/components/FollowUpRadar";
import { FunnelPanel } from "@/components/FunnelPanel";
import { KpiGrid } from "@/components/KpiGrid";
import { LostReasonsChart } from "@/components/LostReasonsChart";
import { RiskLeads } from "@/components/RiskLeads";
import { ScoringMethodology } from "@/components/ScoringMethodology";
import { WeeklyReport } from "@/components/WeeklyReport";
import { classifyMessage, fetchDemo } from "@/lib/api";
import type { ClassifyResponse, DashboardSummary } from "@/types";

export default function HomePage() {
  const [demo, setDemo] = useState<DashboardSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [classifyError, setClassifyError] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Oi, vi o anúncio. Quero fechar hoje — pode me passar o orçamento pelo WhatsApp?",
  );
  const [classification, setClassification] = useState<ClassifyResponse | null>(
    null,
  );
  const [classifying, setClassifying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchDemo()
      .then((summary) => {
        if (!cancelled) setDemo(summary);
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onClassify() {
    setClassifying(true);
    setClassifyError(null);
    try {
      const result = await classifyMessage({
        message,
        channel: "whatsapp",
        hours_since_last_touch: 26,
      });
      setClassification(result);
    } catch (err) {
      setClassifyError(
        err instanceof Error ? err.message : "Falha na classificação",
      );
    } finally {
      setClassifying(false);
    }
  }

  return (
    <main id="conteudo">
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <header className="hero">
        <div className="brand">LeadPulse · Lab demo</div>
        <h1>Cockpit de follow-up para quem vende no WhatsApp</h1>
        <p>
          Transforme conversas soltas em funil, tempo de resposta, leads
          esquecidos e tarefas priorizadas — sem virar um CRM corporativo
          pesado.
        </p>
        <p className="notice" role="note">
          Snapshot sintético de 12 leads (WhatsApp / Instagram / formulário).
          KPIs e opportunity score são do lab — não métricas de produção nem
          integração oficial com WhatsApp.
        </p>
      </header>

      {loadError ? (
        <p className="error" role="alert">
          Não foi possível carregar o cockpit: {loadError}
        </p>
      ) : null}

      {!demo && !loadError ? <DemoSkeleton /> : null}

      {demo ? (
        <>
          <KpiGrid kpis={demo.kpis} conversionRate={demo.conversion_rate} />

          <section className="grid two-col section-gap">
            <FollowUpRadar tasks={demo.follow_ups} />
            <FunnelPanel funnel={demo.funnel} />
          </section>

          <section className="grid two-col section-gap">
            <RiskLeads leads={demo.top_risk_leads} />
            <LostReasonsChart reasons={demo.lost_reasons} />
          </section>

          <section className="grid two-col">
            <WeeklyReport highlights={demo.weekly_highlights} />
            <ClassifyPanel
              message={message}
              onMessageChange={setMessage}
              onClassify={onClassify}
              classifying={classifying}
              classification={classification}
              error={classifyError}
            />
          </section>

          <section className="section-gap">
            <ScoringMethodology />
          </section>
        </>
      ) : null}
    </main>
  );
}
