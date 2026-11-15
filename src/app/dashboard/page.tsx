"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSolar } from "@/context/SolarContext";
import { formatPKR, formatNumber, cn } from "@/lib/utils";
import {
  Sun,
  Zap,
  BatteryCharging,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  Gauge,
  Activity,
  ArrowUpRight,
  Lock,
  Radio,
  FileText,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const {
    sensorData,
    sensorHistory,
    isSensorCompromised,
    simulateMitmAttack,
    restartSystem,
    kpis,
    isEmergencyLocked,
    logs,
  } = useSolar();

  const [activeTab, setActiveTab] = useState<"live" | "logs">("live");

  // Format chart data
  const chartData = sensorHistory.length > 0
    ? sensorHistory
    : [
        { timestamp: "12:00:00", voltage: 398.2, powerKw: 8.8, efficiency: 94.2 },
        { timestamp: "12:00:03", voltage: 400.1, powerKw: 9.1, efficiency: 94.5 },
        { timestamp: "12:00:06", voltage: 399.5, powerKw: 8.9, efficiency: 94.7 },
        { timestamp: "12:00:09", voltage: 401.0, powerKw: 9.3, efficiency: 94.9 },
        { timestamp: "12:00:12", voltage: 398.8, powerKw: 9.0, efficiency: 94.6 },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header / System Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              SENTINEL TELEMETRY COCKPIT
            </h1>
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border flex items-center gap-1.5",
                isSensorCompromised
                  ? "bg-red-950/80 border-red-500 text-red-400 shadow-alert-glow animate-pulse"
                  : isEmergencyLocked
                  ? "bg-red-950/80 border-red-500 text-red-400 animate-pulse"
                  : "bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-solar-glow"
              )}
            >
              <Radio className="w-3 h-3 animate-pulse" />
              {isSensorCompromised
                ? "MITM ATTACK QUARANTINE"
                : isEmergencyLocked
                ? "EMERGENCY FROZEN"
                : "RS-485 ENCRYPTED SYNC"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Plant ID: #SLR-KARACHI-09 // Microgrid Node #4 // Interval: 3.0s Polling
          </p>
        </div>

        {/* Action Buttons required by specification */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Button: Simulate MITM Attack on Sensors */}
          <button
            onClick={simulateMitmAttack}
            disabled={isSensorCompromised}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-md",
              isSensorCompromised
                ? "bg-red-950/50 text-red-500/50 border border-red-900/50 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 text-white border border-red-400 hover:shadow-alert-glow active:scale-95"
            )}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Simulate MITM Attack on Sensors</span>
          </button>

          {/* Button: Restart System & Clear Malicious Data */}
          <button
            onClick={restartSystem}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider border border-emerald-400 shadow-solar-glow active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart System & Clear Malicious Data</span>
          </button>

          {/* Direct link to Sell */}
          <Link
            href="/sell"
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all",
              isSensorCompromised || isEmergencyLocked
                ? "bg-zinc-900/80 text-zinc-500 border-zinc-800 pointer-events-auto"
                : "bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40 shadow-solar-glow"
            )}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Sell Energy</span>
            {(isSensorCompromised || isEmergencyLocked) && (
              <span className="text-[10px] bg-red-900/80 text-red-300 px-1 rounded font-mono ml-1">
                FROZEN
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 4 KPIs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Generated Today */}
        <div className="relative p-5 rounded-2xl bg-[#091710] border border-emerald-500/30 shadow-solar-glow hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
              Generated Today
            </span>
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {formatNumber(kpis.generatedToday, 1)}
            </span>
            <span className="text-xs font-mono text-emerald-400">kWh</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 border-t border-emerald-500/10 pt-2">
            <span>Peak: 9.8 kW</span>
            <span className="text-emerald-400 font-semibold">+14.2% vs yesterday</span>
          </div>
        </div>

        {/* KPI 2: Consumed */}
        <div className="relative p-5 rounded-2xl bg-[#091710] border border-emerald-500/30 shadow-solar-glow hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
              Consumed
            </span>
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {formatNumber(kpis.consumedToday, 1)}
            </span>
            <span className="text-xs font-mono text-emerald-400">kWh</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 border-t border-emerald-500/10 pt-2">
            <span>Facility Load: 35.4%</span>
            <span className="text-emerald-400 font-semibold">Self-Sufficient</span>
          </div>
        </div>

        {/* KPI 3: Excess */}
        <div className="relative p-5 rounded-2xl bg-[#091710] border border-emerald-500/30 shadow-solar-glow hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
              Excess (Surplus)
            </span>
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {formatNumber(kpis.excessToday, 1)}
            </span>
            <span className="text-xs font-mono text-emerald-400">kWh</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 border-t border-emerald-500/10 pt-2">
            <span>Ready for Export</span>
            <span className="text-emerald-400 font-semibold">K-Electric Net Ready</span>
          </div>
        </div>

        {/* KPI 4: Earned PKR */}
        <div className="relative p-5 rounded-2xl bg-[#091710] border border-emerald-500/30 shadow-solar-glow hover:border-emerald-500/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
              Earned PKR
            </span>
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
              {formatPKR(kpis.earnedPKR)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 border-t border-emerald-500/10 pt-2">
            <span>Tariff: 25 PKR/kWh</span>
            <span className="text-emerald-400 font-semibold">Settled</span>
          </div>
        </div>
      </div>

      {/* 4 Sensor Cards (Updating every 3s via setInterval) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">
              Live Inverter Sensors (RS-485 Modbus)
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/80">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated: {sensorData.timestamp}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* SENSOR 1: Voltage (V) */}
          <div className="relative rounded-2xl bg-[#08150e] border border-emerald-500/30 p-5 shadow-solar-glow overflow-hidden transition-all group">
            {/* Compromised Blur Overlay */}
            {isSensorCompromised && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-red-950/80 flex flex-col items-center justify-center p-4 text-center border-2 border-red-500 animate-in fade-in">
                <ShieldAlert className="w-8 h-8 text-red-400 mb-1 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider text-red-200">
                  FILTERED DATA - UNTRUSTED
                </span>
                <span className="text-[10px] font-mono text-red-300 mt-1">
                  MALICIOUS VOLTAGE PACKET
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Sensor #1: Voltage</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-4xl font-black font-mono tracking-tight",
                isSensorCompromised ? "text-red-400" : "text-white"
              )}>
                {sensorData.voltage.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-emerald-400">V</span>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">Nominal: 400.0V</span>
              <span className={isSensorCompromised ? "text-red-400 font-bold" : "text-emerald-400"}>
                {isSensorCompromised ? "HIGH HARMONIC" : "STABLE ±1.2%"}
              </span>
            </div>
          </div>

          {/* SENSOR 2: Current (A) */}
          <div className="relative rounded-2xl bg-[#08150e] border border-emerald-500/30 p-5 shadow-solar-glow overflow-hidden transition-all group">
            {isSensorCompromised && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-red-950/80 flex flex-col items-center justify-center p-4 text-center border-2 border-red-500 animate-in fade-in">
                <ShieldAlert className="w-8 h-8 text-red-400 mb-1 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider text-red-200">
                  FILTERED DATA - UNTRUSTED
                </span>
                <span className="text-[10px] font-mono text-red-300 mt-1">
                  CURRENT SPIKE SPOOF
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Sensor #2: Current</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-4xl font-black font-mono tracking-tight",
                isSensorCompromised ? "text-red-400" : "text-white"
              )}>
                {sensorData.current.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-emerald-400">A</span>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">Max Rating: 32.0A</span>
              <span className={isSensorCompromised ? "text-red-400 font-bold" : "text-emerald-400"}>
                {isSensorCompromised ? "OVERLOAD MASKED" : "OPTIMAL LOAD"}
              </span>
            </div>
          </div>

          {/* SENSOR 3: Temp (°C) */}
          <div className="relative rounded-2xl bg-[#08150e] border border-emerald-500/30 p-5 shadow-solar-glow overflow-hidden transition-all group">
            {isSensorCompromised && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-red-950/80 flex flex-col items-center justify-center p-4 text-center border-2 border-red-500 animate-in fade-in">
                <ShieldAlert className="w-8 h-8 text-red-400 mb-1 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider text-red-200">
                  FILTERED DATA - UNTRUSTED
                </span>
                <span className="text-[10px] font-mono text-red-300 mt-1">
                  THERMAL ANOMALY INJECTED
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Sensor #3: Inverter Temp</span>
              <Thermometer className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-4xl font-black font-mono tracking-tight",
                isSensorCompromised ? "text-red-400" : "text-white"
              )}>
                {sensorData.temperature.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-emerald-400">°C</span>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">Safe Range: &lt; 65°C</span>
              <span className={isSensorCompromised ? "text-red-400 font-bold" : "text-emerald-400"}>
                {isSensorCompromised ? "THERMAL WARNING" : "COOLED (NORMAL)"}
              </span>
            </div>
          </div>

          {/* SENSOR 4: Efficiency (%) */}
          <div className="relative rounded-2xl bg-[#08150e] border border-emerald-500/30 p-5 shadow-solar-glow overflow-hidden transition-all group">
            {isSensorCompromised && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-red-950/80 flex flex-col items-center justify-center p-4 text-center border-2 border-red-500 animate-in fade-in">
                <ShieldAlert className="w-8 h-8 text-red-400 mb-1 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider text-red-200">
                  FILTERED DATA - UNTRUSTED
                </span>
                <span className="text-[10px] font-mono text-red-300 mt-1">
                  MPPT CORRUPTION DETECTED
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-zinc-400">Sensor #4: Efficiency</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-4xl font-black font-mono tracking-tight",
                isSensorCompromised ? "text-red-400" : "text-white"
              )}>
                {sensorData.efficiency.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-emerald-400">%</span>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">Benchmark: &gt; 92%</span>
              <span className={isSensorCompromised ? "text-red-400 font-bold" : "text-emerald-400"}>
                {isSensorCompromised ? "DEGRADED MPPT" : "TIER 1 RATING"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Recharts Chart */}
      <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                Live Inverter Telemetry Stream (3-Second Windows)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              RS-485 Modbus RTU Packet Hash Validation Pipeline
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("live")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors",
                activeTab === "live"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Waveform Visualizer
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors",
                activeTab === "logs"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Audit Trail ({logs.length})
            </button>
          </div>
        </div>

        {activeTab === "live" ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0e2a1b" />
                <XAxis dataKey="timestamp" stroke="#4ade80" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#4ade80"
                  fontSize={11}
                  tickLine={false}
                  domain={["dataMin - 10", "dataMax + 10"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#06130b",
                    borderColor: "#10b981",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="voltage"
                  name="Voltage (V)"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#glowColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#040a06] border border-emerald-500/20 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-bold",
                      log.severity === "CRITICAL"
                        ? "bg-red-950 text-red-400 border border-red-700"
                        : log.severity === "WARNING"
                        ? "bg-amber-950 text-amber-400 border border-amber-700"
                        : log.severity === "SUCCESS"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-700"
                        : "bg-zinc-900 text-zinc-300"
                    )}
                  >
                    {log.severity}
                  </span>
                  <span className="font-semibold text-zinc-200">{log.action}</span>
                  <span className="text-zinc-400 hidden sm:inline">- {log.details}</span>
                </div>
                <span className="text-zinc-500 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          href="/security/sbom"
          className="p-4 rounded-xl bg-[#07130c] border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-solar-glow transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                C1: Software Bill of Materials (SBOM)
              </h4>
              <p className="text-[11px] text-zinc-400 font-mono">
                Verify CVE-2024-9999 & Hot-Patch
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>

        <Link
          href="/security/stress-test"
          className="p-4 rounded-xl bg-[#07130c] border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-solar-glow transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                C2: Race Condition Stress Test
              </h4>
              <p className="text-[11px] text-zinc-400 font-mono">
                30 Concurrent Atomic Sell Requests
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>

        <Link
          href="/emergency"
          className="p-4 rounded-xl bg-[#07130c] border border-red-500/20 hover:border-red-500/50 hover:shadow-alert-glow transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-950 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">
                C3: Emergency Kill-Switch
              </h4>
              <p className="text-[11px] text-zinc-400 font-mono">
                Sub-30s Total Financial Outflow Cutoff
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

