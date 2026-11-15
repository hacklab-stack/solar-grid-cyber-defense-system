"use client";

import React from "react";
import { useSolar } from "@/context/SolarContext";
import {
  AlertTriangle,
  RotateCcw,
  X,
  Radio,
  Lock,
} from "lucide-react";

export const MitmModal = () => {
  const {
    showMitmModal,
    dismissMitmModal,
    restartSystem,
    isSensorCompromised,
  } = useSolar();

  if (!showMitmModal || !isSensorCompromised) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1c0808] to-[#0d0303] border-2 border-red-500/80 p-6 shadow-alert-glow text-white overflow-hidden">
        {/* Subtle red scanlines */}
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={dismissMitmModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-red-300 hover:text-white hover:bg-red-950/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-red-600/30 border border-red-500 rounded-xl text-red-400 shrink-0 animate-pulse">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 uppercase font-semibold">
                SECURITY INCIDENT #SEC-MITM-01
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-red-400 mt-1">
              🚨 CRITICAL: MITM Attack Detected!
            </h2>
            <p className="text-sm font-semibold text-red-200">
              Sensor Data Manipulated! Displaying FILTERED DATA. System Paused.
            </p>
          </div>
        </div>

        {/* Incident Summary Box */}
        <div className="rounded-xl bg-red-950/50 border border-red-800/60 p-4 space-y-2 mb-5 font-mono text-xs">
          <div className="flex items-center justify-between text-red-300 pb-2 border-b border-red-900/60">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-400" />
              Attack Vector:
            </span>
            <span className="font-semibold text-red-100">RS-485 Modbus Inverter Spoof</span>
          </div>
          <div className="flex items-center justify-between text-red-300 pb-2 border-b border-red-900/60">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              Sensor Telemetry:
            </span>
            <span className="font-semibold text-amber-300">QUARANTINED & FROZEN</span>
          </div>
          <div className="flex items-center justify-between text-red-300">
            <span>Trading & Outflows:</span>
            <span className="font-black text-red-400 uppercase">AUTO-DISABLED (FROZEN)</span>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
          The Sentinel Inverter Firewall detected fraudulent packet injection on the Modbus telemetry bus.
          Harmonics and voltage signatures failed SHA-256 cryptographic parity.
          Raw readings are locked in quarantine to protect physical storage batteries and financial ledgers.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={restartSystem}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase shadow-solar-glow transition-all border border-emerald-400"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart System & Clear Malicious Data</span>
          </button>
          <button
            onClick={dismissMitmModal}
            className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-700 transition-colors"
          >
            Keep Isolated
          </button>
        </div>
      </div>
    </div>
  );
};

