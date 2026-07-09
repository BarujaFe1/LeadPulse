export type Stage =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export type Temperature = "hot" | "warm" | "cold";

export interface Lead {
  id: string;
  name: string;
  channel: string;
  stage: Stage;
  owner: string;
  source: string;
  created_at: string;
  first_response_minutes: number | null;
  last_touch_at: string;
  next_follow_up_at: string | null;
  opportunity_score: number;
  estimated_revenue: number;
  temperature: Temperature;
  lost_reason: string | null;
  notes: string;
  tags: string[];
}

export interface FollowUpTask {
  id: string;
  lead_id: string;
  lead_name: string;
  due_at: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  status: "open" | "done" | "snoozed";
}

export interface FunnelStage {
  stage: Stage;
  count: number;
  revenue: number;
}

export interface ResponseKpi {
  median_first_response_minutes: number;
  p90_first_response_minutes: number;
  unanswered_over_24h: number;
  forgotten_leads: number;
  open_follow_ups: number;
  hot_leads: number;
  at_risk_revenue: number;
}

export interface LostReason {
  reason: string;
  count: number;
  revenue_impact: number;
}

export interface DashboardSummary {
  total_leads: number;
  active_leads: number;
  won_leads: number;
  lost_leads: number;
  conversion_rate: number;
  kpis: ResponseKpi;
  funnel: FunnelStage[];
  lost_reasons: LostReason[];
  top_risk_leads: Lead[];
  follow_ups: FollowUpTask[];
  weekly_highlights: string[];
}

export interface ClassifyResponse {
  temperature: Temperature;
  suggested_stage: Stage;
  opportunity_score: number;
  rationale: string[];
  next_action: string;
}
