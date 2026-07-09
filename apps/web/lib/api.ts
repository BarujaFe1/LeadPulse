import {
  buildDashboard,
  classifyMessageClient,
} from "@/lib/engine";
import type { ClassifyResponse, DashboardSummary, Lead } from "@/types";
import { DEMO_LEADS } from "@/lib/demo-leads";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Prefer browser engine for the Vercel lab demo.
 * Optional FastAPI backend when NEXT_PUBLIC_API_URL is set (local full stack).
 */
async function tryBackend<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      ...init,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchDemo(): Promise<DashboardSummary> {
  const remote = await tryBackend<DashboardSummary>("/api/demo");
  return remote ?? buildDashboard();
}

export async function fetchLeads(): Promise<Lead[]> {
  const remote = await tryBackend<Lead[]>("/api/leads");
  return remote ?? DEMO_LEADS;
}

export async function classifyMessage(payload: {
  message: string;
  channel?: string;
  hours_since_last_touch?: number;
}): Promise<ClassifyResponse> {
  const remote = await tryBackend<ClassifyResponse>("/api/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return remote ?? classifyMessageClient(payload);
}
