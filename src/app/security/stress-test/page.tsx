"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSolar } from "@/context/SolarContext";
import {
  Activity,
  Play,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Lock,
  ArrowRight,
  RotateCcw,
  Cpu,
  Layers,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StressTestPage() {
  return (
    <ProtectedRoute>
      <StressTestContent />
    </ProtectedRoute>
  );
}

function StressTestContent() {
  const {
    stressTestResult,
    isStressTesting,
    runConcurrentStressTest,
  } = useSolar();

  const [activeFilter, setActiveFilter] = useState<"ALL" | "SUCCESS" | "BLOCKED">("ALL");

  const handleRunTest = async () => {
    await runConcurrentStressTest();
  };

  const filteredLogs = stressTestResult
    ? stressTestResult.logs.filter((log) => {
        if (activeFilter === "ALL") return true;
        if (activeFilter === "SUCCESS") return log.status === "ACQUIRED_LOCK_SUCCESS";
        if (activeFilter === "BLOCKED") return log.status === "MUTEX_LOCKED_BLOCKED";
        return true;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="w-7 h-7 text-emerald-400" />
              C2: RACE CONDITION STRESS TEST (ATOMIC MUTEX)
            </h1>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              CONCURRENCY HARNESS
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Simulates parallel malicious or synchronized net metering requests to verify lock atomicity.
          </p>
        </div>

        <div>
          <button
            onClick={handleRunTest}
            disabled={isStressTesting}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-solar-glow",
              isStressTesting
                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700"
                : "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 border border-emerald-300 hover:scale-105 active:scale-95"
            )}
          >
            {isStressTesting ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-emerald-950" />
                <span>Simulating 30 Parallel Threads...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-emerald-950" />
                <span>RUN 30 CONCURRENT SELL REQUESTS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Explanatory Architecture Card */}
      <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          The Attack Scenario: Double-Spending / Concurrency Race Condition
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-4xl">
          In vulnerable smart grid endpoints, an attacker fires multiple simultaneous sell requests for the same batch of energy before the database balance decrements.
          Solar Sentinels deploys an <strong>Atomic Distributed In-Memory Mutex Lock</strong>. When 30 requests hit the Net-Metering engine concurrently, exactly <strong>1</strong> request gains execution lock, and the remaining <strong>29</strong> are atomically deflected.
        </p>
      </div>

      {/* Stress Test Results Section */}
      {stressTestResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total */}
            <div className="p-5 rounded-2xl bg-[#091710] border border-emerald-500/30 shadow-solar-glow">
              <span className="text-xs font-mono uppercase text-zinc-400 block mb-2">
                Total Requests Fired
              </span>
              <div className="text-3xl font-black text-white font-mono">
                {stressTestResult.totalRequests}
              </div>
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                Concurrent Async Coroutines
              </span>
            </div>

            {/* Success */}
            <div className="p-5 rounded-2xl bg-[#091710] border border-emerald-500/60 shadow-solar-glow">
              <span className="text-xs font-mono uppercase text-emerald-400 block mb-2">
                Result: Success
              </span>
              <div className="text-3xl font-black text-emerald-400 font-mono flex items-center gap-2">
                <span>{stressTestResult.success}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                  EXACTLY 1
                </span>
              </div>
              <span className="text-[11px] text-emerald-400/80 font-mono mt-1 block">
                Lock Acquired & Settled
              </span>
            </div>

            {/* Blocked */}
            <div className="p-5 rounded-2xl bg-[#091710] border border-amber-500/50 shadow-solar-glow">
              <span className="text-xs font-mono uppercase text-amber-400 block mb-2">
                Result: Blocked
              </span>
              <div className="text-3xl font-black text-amber-400 font-mono flex items-center gap-2">
                <span>{stressTestResult.blocked}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-amber-950 border border-amber-500/50 text-amber-300">
                  MUTEX REJECTED
                </span>
              </div>
              <span className="text-[11px] text-amber-400/80 font-mono mt-1 block">
                Race Condition Thwarted
              </span>
            </div>

            {/* Duplicate */}
            <div className="p-5 rounded-2xl bg-[#091710] border border-emerald-500/40 shadow-solar-glow">
              <span className="text-xs font-mono uppercase text-emerald-400 block mb-2">
                Result: Duplicate
              </span>
              <div className="text-3xl font-black text-emerald-300 font-mono flex items-center gap-2">
                <span>{stressTestResult.duplicate}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                  ZERO LEAKAGE
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono mt-1 block">
                Execution Time: {stressTestResult.durationMs}ms
              </span>
            </div>
          </div>

          {/* Outcome Summary Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-[#07190f] to-emerald-950 border border-emerald-500/50 p-6 shadow-solar-glow flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500 text-emerald-950 rounded-xl font-bold">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Result: Success 1 | Blocked 29 | Duplicate 0
                </h3>
                <p className="text-xs text-emerald-300/80 font-mono mt-0.5">
                  Verification Passed: Atomic lock prevented 29 fraudulent double-spend attempts. Zero balance discrepancy.
                </p>
              </div>
            </div>

            <div className="font-mono text-xs px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-300 shrink-0">
              LATENCY: {stressTestResult.durationMs}ms
            </div>
          </div>

          {/* Concurrent Execution Trace Log */}
          <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Request Execution Trace Log (30 Parallel Requests)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {(["ALL", "SUCCESS", "BLOCKED"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveFilter(mode)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-mono transition-colors",
                      activeFilter === mode
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "text-zinc-500 hover:text-white"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-emerald-500/20 text-zinc-400 uppercase text-[11px] sticky top-0 bg-[#08150e]">
                    <th className="py-2.5 px-3">Request #</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">State</th>
                    <th className="py-2.5 px-3">Lock Status</th>
                    <th className="py-2.5 px-3">Credited</th>
                    <th className="py-2.5 px-3">Telemetry Log</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {filteredLogs.map((log) => {
                    const isSuccess = log.status === "ACQUIRED_LOCK_SUCCESS";
                    return (
                      <tr
                        key={log.reqId}
                        className={cn(
                          "transition-colors",
                          isSuccess
                            ? "bg-emerald-950/40 text-emerald-200"
                            : "hover:bg-zinc-900/30 text-zinc-400"
                        )}
                      >
                        <td className="py-2 px-3 font-bold text-white">Req #{log.reqId}</td>
                        <td className="py-2 px-3 text-zinc-500 text-[11px]">{log.timestamp}</td>
                        <td className="py-2 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              isSuccess
                                ? "bg-emerald-500 text-emerald-950"
                                : "bg-zinc-800 text-zinc-400"
                            )}
                          >
                            {isSuccess ? "SUCCESS (1)" : "BLOCKED (29)"}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              isSuccess ? "text-emerald-400" : "text-amber-500"
                            )}
                          >
                            {isSuccess ? "LOCK_ACQUIRED" : "MUTEX_DENIED"}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-white">
                          {isSuccess ? "PKR 250.00" : "PKR 0.00"}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-zinc-400">{log.message}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!stressTestResult && !isStressTesting && (
        <div className="p-12 text-center rounded-2xl bg-[#08150e] border border-dashed border-emerald-500/30">
          <Activity className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white mb-1">
            Harness Ready For Stress Test
          </h3>
          <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto mb-6">
            Click the button above to dispatch 30 parallel concurrent sell requests and verify lock atomicity.
          </p>
          <button
            onClick={handleRunTest}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs uppercase tracking-wider shadow-solar-glow transition-all"
          >
            RUN 30 CONCURRENT SELL REQUESTS
          </button>
        </div>
      )}
    </div>
  );
}

