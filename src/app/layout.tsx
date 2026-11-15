import type { Metadata } from "next";
import "./globals.css";
import { SolarProvider } from "@/context/SolarContext";
import { Navbar } from "@/components/Navbar";
import { MitmAlertBanner } from "@/components/MitmAlertBanner";
import { MitmModal } from "@/components/MitmModal";

export const metadata: Metadata = {
  title: "SOLAR SENTINELS - Secure Energy Monitoring & Grid Trading",
  description:
    "Next-generation solar telemetry monitoring, K-Electric net metering grid exchange, and industrial cyber security defense system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-[#060b08] text-zinc-100 min-h-screen flex flex-col">
        <SolarProvider>
          <div className="flex flex-col min-h-screen bg-cyber-grid">
            <Navbar />
            <MitmAlertBanner />
            <MitmModal />
            <main className="flex-1 w-full">{children}</main>
            <footer className="border-t border-emerald-950/60 bg-[#040805] py-6 px-4 text-center text-xs text-emerald-500/50 font-mono">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>SOLAR SENTINELS DEFENSE CORE © 2026 // K-ELECTRIC GRID AMI #AMI-904</span>
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Modbus RS-485 Cryptographically Monitored
                </span>
              </div>
            </footer>
          </div>
        </SolarProvider>
      </body>
    </html>
  );
}
