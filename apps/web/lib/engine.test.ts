import { describe, expect, it } from "vitest";
import { DEMO_LEADS } from "@/lib/demo-leads";
import {
  buildDashboard,
  buildFollowUps,
  classifyMessageClient,
  isForgotten,
} from "@/lib/engine";

describe("isForgotten", () => {
  it("flags leads with no first response", () => {
    const lead = DEMO_LEADS.find((item) => item.id === "L-004");
    expect(lead).toBeDefined();
    expect(isForgotten(lead!)).toBe(true);
  });

  it("ignores won/lost stages", () => {
    const won = DEMO_LEADS.find((item) => item.stage === "won")!;
    expect(isForgotten(won)).toBe(false);
  });
});

describe("buildDashboard", () => {
  it("returns stable KPIs for the synthetic snapshot", () => {
    const demo = buildDashboard();
    expect(demo.total_leads).toBe(12);
    expect(demo.funnel).toHaveLength(6);
    expect(demo.kpis.forgotten_leads).toBe(7);
    expect(demo.kpis.at_risk_revenue).toBe(15137);
    expect(demo.kpis.median_first_response_minutes).toBe(34.5);
    expect(demo.conversion_rate).toBe(33.3);
    expect(demo.weekly_highlights.some((h) => h.includes("motivo de perda"))).toBe(
      true,
    );
  });

  it("builds prioritized follow-ups", () => {
    const tasks = buildFollowUps();
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0].priority).toBe("critical");
  });
});

describe("classifyMessageClient", () => {
  it("keeps hot next_action when silence also applies", () => {
    const result = classifyMessageClient({
      message: "Quero fechar hoje, pode me passar o orçamento?",
      channel: "whatsapp",
      hours_since_last_touch: 30,
    });
    expect(result.temperature).toBe("hot");
    expect(result.opportunity_score).toBeGreaterThanOrEqual(60);
    expect(result.next_action).toContain("15 minutos");
    expect(result.rationale.some((r) => r.includes("24h"))).toBe(true);
  });

  it("suggests critical follow-up for silent non-hot messages", () => {
    const result = classifyMessageClient({
      message: "Oi, tudo bem?",
      channel: "whatsapp",
      hours_since_last_touch: 48,
    });
    expect(result.next_action).toContain("follow-up");
  });
});
