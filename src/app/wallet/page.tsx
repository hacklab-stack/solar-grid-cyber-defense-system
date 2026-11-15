"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSolar } from "@/context/SolarContext";
import { formatPKR, formatNumber, cn } from "@/lib/utils";
import {
  Wallet,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  ArrowDownLeft,
  Calendar,
  Lock,
  Download,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <WalletContent />
    </ProtectedRoute>
  );
}

function WalletContent() {
  const {
    walletBalance,
    transactions,
    isSensorCompromised,
    isEmergencyLocked,
  } = useSolar();

  const [filterType, setFilterType] = useState<string>("ALL");

  // Mock weekly revenue chart data
  const weeklyData = [
    { day: "Mon", exportedKWh: 38.5, earnedPKR: 962.5 },
    { day: "Tue", exportedKWh: 42.0, earnedPKR: 1050.0 },
    { day: "Wed", exportedKWh: 35.2, earnedPKR: 880.0 },
    { day: "Thu", exportedKWh: 45.8, earnedPKR: 1145.0 },
    { day: "Fri", exportedKWh: 39.4, earnedPKR: 985.0 },
    { day: "Sat", exportedKWh: 48.0, earnedPKR: 1200.0 },
    { day: "Sun", exportedKWh: 44.2, earnedPKR: 1105.0 },
  ];

  const totalWeeklyPKR = weeklyData.reduce((acc, curr) => acc + curr.earnedPKR, 0);
  const totalWeeklyKWh = weeklyData.reduce((acc, curr) => acc + curr.exportedKWh, 0);

  const isFrozen = isSensorCompromised || isEmergencyLocked;

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "ALL") return true;
    return t.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner if Frozen */}
      {isFrozen && (
        <div className="rounded-2xl bg-gradient-to-r from-red-950 via-[#200808] to-red-950 border-2 border-red-500 p-4 text-xs font-mono text-red-200 flex items-center justify-between gap-4 shadow-alert-glow animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <span>
              <strong>WALLET FROZEN:</strong> Outflows, payouts, and automated banking transfers are blocked due to active security protocol.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black uppercase text-[10px]">
            LOCKED
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-7 h-7 text-emerald-400" />
            SOLAR SENTINEL TREASURY & WALLET
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Real-time net metering settlement balance, K-Electric payouts, and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sell"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs tracking-wider shadow-solar-glow transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>Sell Energy Surplus</span>
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="md:col-span-1 rounded-2xl bg-[#091810] border border-emerald-500/40 p-6 shadow-solar-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
                Total Settled Balance
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border",
                  isFrozen
                    ? "bg-red-950 text-red-400 border-red-800"
                    : "bg-emerald-950 text-emerald-400 border-emerald-500/30"
                )}
              >
                {isFrozen ? "FROZEN" : "LIQUID"}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono">
                {formatPKR(walletBalance)}
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Bank Sync: Habib Bank Limited (HBL) Net-Metering A/C
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>NEPRA Tariff:</span>
            <span className="text-emerald-400 font-bold">25.00 PKR/kWh Fixed</span>
          </div>
        </div>

        {/* 7-Day Net Yield Card */}
        <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
                7-Day Net Payout
              </span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="text-3xl font-black text-white font-mono">
              {formatPKR(totalWeeklyPKR)}
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Generated from {formatNumber(totalWeeklyKWh, 1)} kWh exported
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/10 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">Daily Average:</span>
            <span className="text-emerald-400 font-semibold">{formatPKR(totalWeeklyPKR / 7)} / day</span>
          </div>
        </div>

        {/* Security & Withdrawal Status */}
        <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
                Automated Settlement
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="text-base font-bold text-white">
              Instant Grid Clearing Enabled
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Cryptographically signed net-metering transactions post immediately to your ledger.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/10 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">Status:</span>
            <span className={isFrozen ? "text-red-400 font-bold" : "text-emerald-400 font-semibold"}>
              {isFrozen ? "HALTED (SECURITY)" : "OPERATIONAL"}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Revenue & Export Chart (Recharts) */}
      <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Weekly Generation & Revenue Breakdown
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Daily K-Electric exported energy (kWh) vs Revenue credited (PKR)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>Tariff benchmark: 25.0 PKR / kWh</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0e2a1b" />
              <XAxis dataKey="day" stroke="#4ade80" fontSize={12} tickLine={false} />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#10b981"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#86efac"
                fontSize={11}
                tickLine={false}
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
              <Legend wrapperStyle={{ fontSize: "12px", fontFamily: "monospace" }} />
              <Bar
                yAxisId="left"
                dataKey="earnedPKR"
                name="Earned (PKR)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="exportedKWh"
                name="Exported (kWh)"
                fill="#22c55e"
                opacity={0.6}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Cryptographic Transaction Ledger</h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Verified records with recipient hashes and NEPRA compliance proof.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Total Entries: {transactions.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-emerald-500/20 text-zinc-400 uppercase text-[11px]">
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Units</th>
                <th className="py-3 px-3">Net Credit</th>
                <th className="py-3 px-3">Tx Hash</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-emerald-950/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-emerald-400">{tx.id}</td>
                  <td className="py-3 px-3 text-zinc-400">{tx.timestamp}</td>
                  <td className="py-3 px-3 text-zinc-300">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/20 text-[10px]">
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white font-semibold">{tx.amountKWh} kWh</td>
                  <td className="py-3 px-3 text-emerald-300 font-bold">{formatPKR(tx.totalPKR)}</td>
                  <td className="py-3 px-3 text-zinc-500 text-[11px]">{tx.txHash}</td>
                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                        tx.status === "COMPLETED"
                          ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                          : "bg-red-950 text-red-400 border-red-500/40"
                      )}
                    >
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

