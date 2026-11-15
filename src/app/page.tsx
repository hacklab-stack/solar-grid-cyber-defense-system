"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Sun,
  Zap,
  ArrowRight,
  ShieldAlert,
  Lock,
  Cpu,
  Radio,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Show modal automatically on page load
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setShowWelcomeModal(false);
    router.push("/login");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* POPUP MODAL ON LOAD */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#091810] to-[#040b07] border border-emerald-500/50 p-6 sm:p-8 shadow-solar-glow-lg text-center">
            {/* Glowing icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-400/50 flex items-center justify-center shadow-solar-glow mb-5">
              <Sun className="w-8 h-8 text-emerald-400 animate-spin-slow" />
            </div>

            {/* Modal Title */}
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              Welcome to Solar Sentinels - Secure Energy Monitoring
            </h2>

            <p className="text-xs sm:text-sm text-emerald-300/80 font-mono mb-6 leading-relaxed">
              Industrial-grade PV telemetry monitoring system with active MITM attack detection,
              atomic grid transaction integrity, and sub-second kill-switch protection.
            </p>

            <div className="bg-[#050f09] rounded-xl border border-emerald-500/20 p-4 mb-6 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3-Second Real-Time Telemetry Pipeline</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>K-Electric Net Metering Gateway @ 25 PKR/kWh</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Trust RS-485 Modbus Inverter Firewall</span>
              </div>
            </div>

            {/* Target Button */}
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-emerald-950 font-black text-sm tracking-wide shadow-solar-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Click to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Hero Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-mono shadow-solar-glow">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>CYBER-PHYSICAL SOLAR INFRASTRUCTURE GUARD</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Defend Your Energy. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.35)]">
            Autonomous Solar Grid Security.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
          High-frequency telemetry acquisition, real-time Modbus MITM defense,
          and secure smart contract settlement with K-Electric AMI infrastructure.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-solar-glow transition-all hover:scale-105"
          >
            <Lock className="w-4 h-4" />
            <span>Launch Sentinel Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowWelcomeModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-sm font-medium transition-all"
          >
            <span>View Welcome Briefing</span>
          </button>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-6 rounded-2xl bg-[#08150e]/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-solar-glow">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Live RS-485 Telemetry</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sub-3 second acquisition of Inverter Voltage, Amperage, Heat signatures, and conversion yields.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08150e]/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-solar-glow">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Active MITM Defense</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Instant heuristic isolation of malicious packet injections with automated financial kill-gates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08150e]/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-solar-glow">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Atomic Energy Trading</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Race-condition-safe grid export to K-Electric at 25 PKR/kWh with sub-second emergency cutoffs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

