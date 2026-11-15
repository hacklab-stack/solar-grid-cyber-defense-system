"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSolar } from "@/context/SolarContext";
import {
  Sun,
  ShieldAlert,
  Zap,
  Wallet,
  FileCode,
  Activity,
  AlertTriangle,
  Lock,
  LogOut,
  Menu,
  X,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isAdminLoggedIn,
    logout,
    isSensorCompromised,
    isEmergencyLocked,
  } = useSolar();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Sun },
    { name: "Sell Energy", href: "/sell", icon: Zap },
    { name: "Wallet", href: "/wallet", icon: Wallet },
    { name: "C1 SBOM", href: "/security/sbom", icon: FileCode },
    { name: "C2 Race Test", href: "/security/stress-test", icon: Activity },
    { name: "C3 Kill-Switch", href: "/emergency", icon: AlertTriangle },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-[#060e0a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isAdminLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-3 group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 group-hover:border-emerald-400 transition-colors shadow-solar-glow">
              <Sun className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-500" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  isSensorCompromised || isEmergencyLocked ? "bg-red-400" : "bg-emerald-400"
                )}></span>
                <span className={cn(
                  "relative inline-flex rounded-full h-3 w-3",
                  isSensorCompromised || isEmergencyLocked ? "bg-red-500" : "bg-emerald-500"
                )}></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-200 bg-clip-text text-transparent">
                  SOLAR SENTINELS
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  v2.4 SECURE
                </span>
              </div>
              <p className="text-[10px] text-emerald-400/60 font-mono tracking-wide hidden sm:block">
                KE-NET METERING #AMI-904
              </p>
            </div>
          </Link>

          {/* Nav Links for Desktop */}
          {isAdminLoggedIn && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                      isActive
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-solar-glow"
                        : "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/40"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-zinc-500")} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Status / Auth */}
          <div className="flex items-center gap-3">
            {/* Status Pills */}
            <div className="hidden sm:flex items-center gap-2">
              {isEmergencyLocked ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 text-xs font-mono animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>KILL-SWITCH ACTIVE</span>
                </div>
              ) : isSensorCompromised ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 text-xs font-mono animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>MITM COMPROMISED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>SENSORS VERIFIED</span>
                </div>
              )}
            </div>

            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-medium text-zinc-200">Admin</span>
                  <span className="text-[10px] font-mono text-emerald-400">admin@solar.local</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/40 hover:border-red-500/60 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-solar-glow transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            {isAdminLoggedIn && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-emerald-950/50"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isAdminLoggedIn && mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-t border-emerald-500/20 bg-[#07130c] space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "text-zinc-300 hover:text-emerald-300 hover:bg-emerald-950/40"
                  )}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

