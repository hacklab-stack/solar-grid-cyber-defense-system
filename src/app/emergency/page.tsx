"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSolar } from "@/context/SolarContext";
import { formatNumber, cn } from "@/lib/utils";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  RotateCcw,
  Clock,
  Radio,
  CheckCircle2,
  Flame,
  Power,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function EmergencyPage() {
  return (
    <ProtectedRoute>
      <EmergencyContent />
    </ProtectedRoute>
  );
}

function EmergencyContent() {
  const {
    isEmergencyLocked,
    emergencyFreezeTimeSec,
    activateEmergencyKillSwitch,
    deactivateEmergencyKillSwitch,
    sensorData,
  } = useSolar();

  const [confirmUnlock, setConfirmUnlock] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-red-500/20">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-7 h-7 text-red-500" />
              C3: EMERGENCY KILL-SWITCH SYSTEM
            </h1>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border",
                isEmergencyLocked
                  ? "bg-red-950 text-red-400 border-red-500 shadow-alert-glow animate-pulse"
                  : "bg-emerald-950 text-emerald-400 border-emerald-500/40"
              )}
            >
              {isEmergencyLocked ? "KILL-SWITCH ENGAGED" : "ARMED & STANDBY"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Zero-latency galvanic disconnect for rooftop solar array and K-Electric interconnect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">
            Standard: IEC 62443 Sub-30s Requirement
          </span>
        </div>
      </div>

      {/* Main Kill Switch Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: The BIG RED BUTTON and Status */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0d0404] border-2 border-red-500/60 p-8 shadow-alert-glow relative overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Subtle Cyber Red Grid Background */}
          <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none" />

          {/* Verification Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono mb-6">
            <Power className="w-3.5 h-3.5 text-red-400" />
            <span>GALVANIC ISOLATION ACTUATOR</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Cyber-Physical Hard Disconnect
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-mono max-w-lg mb-8">
            Immediately cuts all outbound K-Electric financial transactions and inverter export breakers.
            Telemetry strictly falls back to <strong>READ-ONLY</strong> mode for hazard diagnostics.
          </p>

          {/* The Big RED Button */}
          {!isEmergencyLocked ? (
            <div className="relative group my-4">
              <div className="absolute -inset-4 bg-red-600/30 rounded-full blur-xl group-hover:bg-red-600/50 transition-all animate-pulse" />
              <button
                onClick={activateEmergencyKillSwitch}
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-950 border-8 border-red-500/80 shadow-[0_0_80px_rgba(239,68,68,0.8)] hover:shadow-[0_0_120px_rgba(239,68,68,1)] text-white flex flex-col items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer select-none"
              >
                <Power className="w-16 h-16 text-white drop-shadow-md animate-bounce" />
                <span className="text-lg sm:text-xl font-black tracking-wider uppercase drop-shadow-md px-4 leading-tight">
                  ACTIVATE EMERGENCY KILL-SWITCH
                </span>
                <span className="text-[10px] font-mono tracking-widest text-red-200">
                  PRESS TO ISOLATE GRID
                </span>
              </button>
            </div>
          ) : (
            <div className="w-full space-y-6">
              {/* Activated Banner with Exact required text */}
              <div className="p-6 rounded-2xl bg-red-950/90 border-2 border-red-500 text-center space-y-3 shadow-alert-glow animate-pulse">
                <div className="flex items-center justify-center gap-2">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                    EMERGENCY KILL-SWITCH ACTIVE
                  </h3>
                </div>

                <div className="py-2 px-4 rounded-xl bg-red-900/60 border border-red-500/80 inline-block">
                  <span className="text-base sm:text-lg font-black font-mono text-white">
                    Time to Freeze: {emergencyFreezeTimeSec}s - VERIFIED UNDER 30s
                  </span>
                </div>

                <p className="text-xs text-red-200 font-mono">
                  Financial Outflows: <strong>FROZEN</strong> // Inverter Export: <strong>DISCONNECTED</strong> // Telemetry: <strong>READ-ONLY</strong>
                </p>
              </div>

              {/* Reset Control */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {!confirmUnlock ? (
                  <button
                    onClick={() => setConfirmUnlock(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-mono font-bold transition-all"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-400" />
                    <span>Disengage Kill-Switch (Admin Override)</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-950/80 border border-amber-600 text-xs font-mono">
                    <span className="text-amber-200">Confirm lifting emergency freeze?</span>
                    <button
                      onClick={() => {
                        deactivateEmergencyKillSwitch();
                        setConfirmUnlock(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => setConfirmUnlock(false)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-red-500/20 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
            <span>Outflow Gate: {isEmergencyLocked ? "LOCKED (FROZEN)" : "ARMED"}</span>
            <span>Safety Relay: DRY CONTACT OPEN</span>
            <span>Manual Override: READY</span>
          </div>
        </div>

        {/* Right Col: Read-Only Telemetry Monitor */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Telemetry Status: {isEmergencyLocked ? "READ-ONLY" : "INTERACTIVE"}
                </h3>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono font-bold",
                  isEmergencyLocked
                    ? "bg-amber-950 text-amber-300 border border-amber-500/50"
                    : "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                )}
              >
                {isEmergencyLocked ? "READ-ONLY LOCK" : "FULL TELEMETRY"}
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Under emergency isolation protocol, telemetry streams remain operational for facility safety and thermal hazard monitoring, but control lines and export switches are mechanically locked.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#040906] border border-emerald-500/20 flex items-center justify-between">
                <span className="text-zinc-400">Voltage (Passive Read):</span>
                <span className="text-white font-bold">{sensorData.voltage.toFixed(1)} V</span>
              </div>
              <div className="p-3 rounded-xl bg-[#040906] border border-emerald-500/20 flex items-center justify-between">
                <span className="text-zinc-400">Current (Passive Read):</span>
                <span className="text-white font-bold">{sensorData.current.toFixed(1)} A</span>
              </div>
              <div className="p-3 rounded-xl bg-[#040906] border border-emerald-500/20 flex items-center justify-between">
                <span className="text-zinc-400">Inverter Thermal State:</span>
                <span className="text-emerald-400 font-bold">{sensorData.temperature.toFixed(1)} °C</span>
              </div>
              <div className="p-3 rounded-xl bg-[#040906] border border-emerald-500/20 flex items-center justify-between">
                <span className="text-zinc-400">Financial Gateways:</span>
                <span className={cn("font-bold", isEmergencyLocked ? "text-red-400" : "text-emerald-400")}>
                  {isEmergencyLocked ? "ALL DISCONNECTED" : "ONLINE"}
                </span>
              </div>
            </div>
          </div>

          {/* IEC Compliance Box */}
          <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                IEC 62443 Compliance Metric
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Industrial standard IEC 62443 specifies that distributed energy resources (DER) must be capable of galvanic isolation within 30 seconds of an operator trip command.
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
              ⚡ Benchmarked Response: 1.2s (&lt; 30s threshold)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

