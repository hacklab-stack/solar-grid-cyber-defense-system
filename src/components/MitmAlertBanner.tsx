"use client";

import React from "react";
import { useSolar } from "@/context/SolarContext";
import { ShieldAlert, RotateCcw } from "lucide-react";

export const MitmAlertBanner = () => {
  const { isSensorCompromised, restartSystem } = useSolar();

  if (!isSensorCompromised) return null;

  return (
    <div className="w-full bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-y border-red-500/70 py-3 px-4 shadow-alert-glow sticky top-16 z-30 animate-pulse">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg text-white shadow-lg animate-bounce">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-bold text-sm sm:text-base text-red-100 uppercase tracking-wide">
                🚨 CRITICAL: MITM Attack Detected! Sensor Data Manipulated!
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-black bg-red-500 text-white animate-pulse">
                FROZEN
              </span>
            </div>
            <p className="text-xs text-red-200/90 font-mono mt-0.5">
              Displaying FILTERED DATA. System Paused. Outflows & Trading disabled automatically.
            </p>
          </div>
        </div>

        <button
          onClick={restartSystem}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide shadow-lg hover:shadow-emerald-500/50 transition-all border border-emerald-400 shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart System & Clear Malicious Data</span>
        </button>
      </div>
    </div>
  );
};

