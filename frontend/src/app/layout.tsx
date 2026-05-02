import type { Metadata } from 'next';
import './globals.css';
import { TelemetryProvider } from "@/context/TelemetryContext";

export const metadata: Metadata = {
  title: 'AquaFlow AI',
  description: 'AI-powered smart water leak detection and automatic response system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <main className="min-h-screen bg-slate-950">
          <TelemetryProvider>{children}</TelemetryProvider>
        </main>
      </body>
    </html>
  );
}

