"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LostReason } from "@/types";

type Props = { reasons: LostReason[] };

export function LostReasonsChart({ reasons }: Props) {
  const chartData = reasons.map((reason) => ({
    reason: reason.reason.replaceAll("_", " "),
    count: reason.count,
    revenue: reason.revenue_impact,
  }));

  return (
    <section className="panel" aria-labelledby="lost-title">
      <h2 id="lost-title">Motivos de perda</h2>
      {chartData.length === 0 ? (
        <p className="muted empty-state">
          Sem perdas no seed — o gráfico aparece quando houver `lost_reason`.
        </p>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
      )}
    </section>
  );
}
