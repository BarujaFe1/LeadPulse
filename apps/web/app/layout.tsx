import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadPulse — WhatsApp-first Follow-up Radar (Lab Demo)",
  description:
    "Synthetic SMB lab for response-time KPIs, forgotten leads, opportunity scoring and weekly follow-up highlights. Not a production WhatsApp CRM.",
  openGraph: {
    title: "LeadPulse Lab Demo",
    description:
      "WhatsApp-first follow-up cockpit with synthetic leads — response SLA, forgotten opportunities and opportunity score.",
    url: "https://leadpulse-two.vercel.app",
    siteName: "LeadPulse",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
