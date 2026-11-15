"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSolar } from "@/context/SolarContext";
import {
  Lock,
  Mail,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Sun,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAdminLoggedIn } = useSolar();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedHint, setCopiedHint] = useState(false);

  useEffect(() => {
    // If already logged in, redirect straight to dashboard
    if (isAdminLoggedIn || localStorage.getItem("isAdminLoggedIn") === "true") {
      router.replace("/dashboard");
    }
  }, [isAdminLoggedIn, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorToast(null);

    // Simulate micro verification delay for realism
    setTimeout(() => {
      const success = login(id.trim(), password);
      setIsSubmitting(false);

      if (success) {
        router.push("/dashboard");
      } else {
        // Exact user requirement: "Wrong ID or Password - Only Admin Access Allowed"
        setErrorToast("Wrong ID or Password - Only Admin Access Allowed");
      }
    }, 300);
  };

  const handleFillDemo = () => {
    setId("admin@solar.local");
    setPassword("Admin@123");
    setCopiedHint(true);
    setTimeout(() => setCopiedHint(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ERROR TOAST */}
      {errorToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/95 border-2 border-red-500 text-red-200 shadow-alert-glow">
            <div className="p-2 bg-red-600 rounded-lg text-white shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-mono font-bold uppercase text-red-400">
                Authentication Denied
              </p>
              <p className="text-sm font-semibold text-white">
                {errorToast}
              </p>
            </div>
            <button
              onClick={() => setErrorToast(null)}
              className="text-red-400 hover:text-white text-xs px-2 py-1 rounded bg-red-900/50"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#08150e]/90 border border-emerald-500/40 p-8 shadow-solar-glow">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 shadow-solar-glow text-emerald-400 mb-3">
            <Sun className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            SOLAR SENTINELS
          </h1>
          <p className="text-xs text-emerald-400/80 font-mono mt-1">
            Secure Industrial Access Portal
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono">
            <span>Fixed Root Operator Gate</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID field */}
          <div>
            <label className="block text-xs font-mono text-emerald-300 mb-1.5">
              Admin Identity (Email / ID)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4 text-emerald-500/70" />
              </div>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="admin@solar.local"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#040906] border border-emerald-500/30 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-mono text-emerald-300 mb-1.5">
              Secure Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <KeyRound className="w-4 h-4 text-emerald-500/70" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#040906] border border-emerald-500/30 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-emerald-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-emerald-950 font-bold text-sm tracking-wide shadow-solar-glow transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="font-mono text-xs">Authenticating Token...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Verify Credentials & Enter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Fixed Admin Credential Helper Box */}
        <div className="mt-6 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-zinc-300">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-emerald-500/20">
            <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
              Fixed Admin Credential Required
            </span>
            <button
              onClick={handleFillDemo}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center gap-1"
            >
              {copiedHint ? <Check className="w-3 h-3 text-emerald-400" /> : null}
              <span>Auto-Fill</span>
            </button>
          </div>
          <div className="font-mono text-[11px] space-y-1 text-zinc-400">
            <p>ID: <span className="text-emerald-300 select-all font-semibold">admin@solar.local</span></p>
            <p>Password: <span className="text-emerald-300 select-all font-semibold">Admin@123</span></p>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 italic">
            * Self-registration is strictly disabled by cybersecurity protocol.
          </p>
        </div>
      </div>
    </div>
  );
}

