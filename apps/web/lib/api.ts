import type { ClassifyResponse, DashboardSummary, Lead } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export function fetchDemo(): Promise<DashboardSummary> {
  return getJson("/api/demo");
}

export function fetchLeads(): Promise<Lead[]> {
  return getJson("/api/leads");
}

export function classifyMessage(payload: {
  message: string;
  channel?: string;
  hours_since_last_touch?: number;
}): Promise<ClassifyResponse> {
  return postJson("/api/classify", payload);
}
