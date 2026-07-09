import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadPulse — WhatsApp-first Lead Analytics & Follow-up Radar",
  description:
    "Capture WhatsApp/Instagram leads, measure response time, surface forgotten opportunities and run a light follow-up cockpit for SMB sales teams.",
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
