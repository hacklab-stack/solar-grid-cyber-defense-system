"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSolar } from "@/context/SolarContext";
import { formatPKR, formatNumber, cn } from "@/lib/utils";
import {
  Zap,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  Building2,
  Radio,
  FileText,
} from "lucide-react";

export default function SellPage() {
  return (
    <ProtectedRoute>
      <SellContent />
    </ProtectedRoute>
  );
}

function SellContent() {
  const {
    kpis,
    sellEnergy,
    isSensorCompromised,
    isEmergencyLocked,
    restartSystem,
    transactions,
  } = useSolar();

  const [sellAmount, setSellAmount] = useState<number>(10);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string | null;
    txId?: string;
    amountPKR?: number;
  }>({ type: null, message: null });

  const tariffRate = 25; // 25 PKR / kWh
  const estimatedPKR = Math.max(0, sellAmount * tariffRate);

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: null, message: null });

    const result = sellEnergy(sellAmount);

    if (result.success) {
      setFeedback({
        type: "success",
        message: `Successfully executed Net Metering export of ${sellAmount} kWh to K-Electric Grid!`,
        txId: result.txId,
        amountPKR: result.earnedPKR,
      });
    } else {
      setFeedback({
        type: "error",
        message: result.error || "Failed to execute energy sale.",
      });
    }
  };

  const handleQuickPercent = (pct: number) => {
    const calculated = Math.floor((kpis.excessToday * pct) * 10) / 10;
    setSellAmount(Math.max(1, calculated));
  };

  const isBlocked = isSensorCompromised || isEmergencyLocked;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Zap className="w-7 h-7 text-emerald-400" />
              K-ELECTRIC NET METERING PORTAL
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              @ 25 PKR / kWh
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Feed surplus rooftop solar yield directly into the Karachi South Smart Grid Interconnect.
          </p>
        </div>

        <Link
          href="/wallet"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-all"
        >
          <span>View Settlements & Wallet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Security Lock Banner if Blocked */}
      {isBlocked && (
        <div className="rounded-2xl bg-gradient-to-r from-red-950 via-[#1e0707] to-red-950 border-2 border-red-500 p-6 shadow-alert-glow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg animate-pulse">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-red-200 uppercase tracking-wide">
                  {isSensorCompromised
                    ? "🚨 TRANSMISSION LOCKED: Inverter Telemetry Compromised (MITM Attack Active)"
                    : "🛑 TRANSMISSION LOCKED: Emergency Kill-Switch Engaged"}
                </h3>
                <p className="text-xs text-red-300 font-mono mt-1">
                  Grid export orders are automatically halted to prevent financial fraud and power corruption.
                </p>
              </div>
            </div>

            {isSensorCompromised ? (
              <button
                onClick={restartSystem}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider border border-emerald-400 shadow-solar-glow transition-all shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart & Restore System</span>
              </button>
            ) : (
              <Link
                href="/emergency"
                className="px-5 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs font-mono tracking-wider transition-all shrink-0"
              >
                Manage Emergency Switch
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Sell Form & Energy Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sell Form Panel */}
        <div className="lg:col-span-2 rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 sm:p-8 shadow-solar-glow relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/10">
            <div>
              <h2 className="text-lg font-bold text-white">Execute Grid Export Order</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Immediate settlement to account via AMI bidirectional smart meter.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-zinc-400 block uppercase">
                Available Surplus
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {formatNumber(kpis.excessToday, 1)} kWh
              </span>
            </div>
          </div>

          {/* Feedback Alerts */}
          {feedback.type === "success" && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sale Confirmed & Ledger Updated!</span>
              </div>
              <p>{feedback.message}</p>
              <div className="pt-2 flex flex-wrap gap-4 text-zinc-300 text-[11px]">
                <span>Tx ID: <strong className="text-white">{feedback.txId}</strong></span>
                <span>Total Credited: <strong className="text-emerald-300">{formatPKR(feedback.amountPKR || 0)}</strong></span>
              </div>
            </div>
          )}

          {feedback.type === "error" && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs font-mono space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Export Blocked by Security Protocol</span>
              </div>
              <p>{feedback.message}</p>
            </div>
          )}

          <form onSubmit={handleSell} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-emerald-300">
                  Energy to Export (kWh)
                </label>
                <div className="flex gap-1.5">
                  {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleQuickPercent(pct)}
                      className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 transition-colors"
                    >
                      {pct === 1.0 ? "MAX" : `${pct * 100}%`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  max={Math.max(0.1, kpis.excessToday)}
                  step="0.1"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-[#040906] border border-emerald-500/40 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  disabled={isBlocked}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-emerald-400">
                  kWh
                </span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="rounded-xl bg-[#040c07] border border-emerald-500/20 p-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Unit Rate (NEPRA Tariff):</span>
                <span className="text-zinc-200">25.00 PKR / kWh</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Buyer Organization:</span>
                <span className="text-zinc-200 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  K-Electric Net-Metering Pool
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Grid Settlement Method:</span>
                <span className="text-emerald-400">Instant Wallet Ledger Credit</span>
              </div>
              <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-sm font-bold">
                <span className="text-emerald-300">Total Payout Credit:</span>
                <span className="text-xl text-emerald-400 font-mono">
                  {formatPKR(estimatedPKR)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isBlocked || sellAmount <= 0 || sellAmount > kpis.excessToday}
              className={cn(
                "w-full py-4 px-6 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md",
                isBlocked
                  ? "bg-red-950/70 border border-red-800 text-red-400 cursor-not-allowed"
                  : sellAmount > kpis.excessToday || sellAmount <= 0
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                  : "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-solar-glow hover:scale-[1.01] active:scale-[0.99]"
              )}
            >
              {isBlocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>TRANSACTION FROZEN - SECURITY LOCK ACTIVE</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Execute Sell Order ({formatPKR(estimatedPKR)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info & Grid Status */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              K-Electric Feeder Telemetry
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/10">
                <span className="text-zinc-400">Grid Line Voltage:</span>
                <span className="text-emerald-300 font-bold">230.4 V (Phase A)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/10">
                <span className="text-zinc-400">Grid Frequency:</span>
                <span className="text-emerald-300 font-bold">{kpis.gridFrequencyHz.toFixed(2)} Hz</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/10">
                <span className="text-zinc-400">Power Factor (PF):</span>
                <span className="text-emerald-300 font-bold">0.99 (Leading)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/10">
                <span className="text-zinc-400">AMI Meter S/N:</span>
                <span className="text-zinc-300 font-bold">KE-SM-449102-PK</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Tariff Code:</span>
                <span className="text-emerald-400 font-bold">A-1 RESIDENTIAL NET</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Net Metering Economics
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every kilowatt-hour generated above self-consumption offsets peak thermal grid stress in Karachi,
              returning 25.00 PKR per unit straight into your verified Sentinel balance.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Grid Sales Table */}
      <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Recent K-Electric Export Settlements</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {transactions.length} Transactions Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-emerald-500/20 text-zinc-400 uppercase text-[11px]">
                <th className="py-3 px-3">Tx ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Export Amount</th>
                <th className="py-3 px-3">Tariff</th>
                <th className="py-3 px-3">Credited Amount</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10">
              {transactions.slice(0, 6).map((tx) => (
                <tr key={tx.id} className="hover:bg-emerald-950/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-emerald-400">{tx.id}</td>
                  <td className="py-3 px-3 text-zinc-400">{tx.timestamp}</td>
                  <td className="py-3 px-3 text-white font-semibold">{tx.amountKWh} kWh</td>
                  <td className="py-3 px-3 text-zinc-400">{tx.ratePKR} PKR/kWh</td>
                  <td className="py-3 px-3 text-emerald-300 font-bold">{formatPKR(tx.totalPKR)}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

