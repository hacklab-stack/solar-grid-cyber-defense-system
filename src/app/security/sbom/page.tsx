"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSolar } from "@/context/SolarContext";
import {
  FileCode,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Terminal,
  Zap,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SbomPage() {
  return (
    <ProtectedRoute>
      <SbomContent />
    </ProtectedRoute>
  );
}

function SbomContent() {
  const { sbomPackages, patchSbomPackage } = useSolar();
  const [patching, setPatching] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePatch = (id: string) => {
    setPatching(id);
    setTimeout(() => {
      patchSbomPackage(id);
      setPatching(null);
    }, 700);
  };

  const vulnerablePkg = sbomPackages.find((p) => p.id === "sensor-data-parser");
  const isVulnerable = vulnerablePkg?.status === "VULNERABLE";

  const exportSbomJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify(
        {
          bomFormat: "CycloneDX",
          specVersion: "1.5",
          serialNumber: "urn:uuid:solar-sentinel-sbom-902",
          version: 1,
          metadata: {
            timestamp: new Date().toISOString(),
            component: {
              name: "Solar Sentinels Telemetry Core",
              version: "2.4.0",
              type: "application",
            },
          },
          components: sbomPackages,
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "solar-sentinels-sbom.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <FileCode className="w-7 h-7 text-emerald-400" />
              C1: SOFTWARE BILL OF MATERIALS (SBOM)
            </h1>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded text-xs font-mono font-bold border",
                isVulnerable
                  ? "bg-red-950 text-red-400 border-red-500 shadow-alert-glow animate-pulse"
                  : "bg-emerald-950 text-emerald-400 border-emerald-500 shadow-solar-glow"
              )}
            >
              {isVulnerable ? "1 CRITICAL CVE DETECTED" : "ALL PACKAGES VERIFIED PASS"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            CycloneDX 1.5 & SPDX Compliant Inventory of all embedded in-memory dependencies and Modbus decoders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportSbomJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-mono text-xs transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess ? "SBOM Exported!" : "Export CycloneDX JSON"}</span>
          </button>
        </div>
      </div>

      {/* Vulnerability Alert Banner if unpatched */}
      {isVulnerable ? (
        <div className="rounded-2xl bg-gradient-to-r from-red-950 via-[#1f0808] to-red-950 border-2 border-red-500 p-6 shadow-alert-glow animate-pulse">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-600 rounded-xl text-white shrink-0 mt-0.5">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-black text-[11px]">
                    CVE-2024-9999
                  </span>
                  <span className="text-xs font-mono text-red-400 font-bold uppercase">
                    RCE CRITICAL (CVSS 9.8)
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Vulnerability Detected in <code className="text-red-300 font-mono">sensor-data-parser@1.2.0</code>
                </h3>
                <p className="text-xs text-red-200/90 font-mono mt-1">
                  Unsanitized Modbus RTU payload allows arbitrary remote code execution via buffer overflow.
                  Attacker can inject false sensor readings and manipulate grid export commands.
                </p>
              </div>
            </div>

            <button
              onClick={() => handlePatch("sensor-data-parser")}
              disabled={patching !== null}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-black text-xs tracking-wider uppercase shadow-lg border border-red-300 hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              {patching === "sensor-data-parser" ? (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 animate-spin text-white" />
                  Applying Patch...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Patch to v1.2.1</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-[#07190f] to-emerald-950 border border-emerald-500/60 p-6 shadow-solar-glow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-xl text-white">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-emerald-950 font-black text-xs font-mono">
                  PASS
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                  ZERO KNOWN VULNERABILITIES
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                sensor-data-parser Upgraded to v1.2.1 (Hardened)
              </h3>
              <p className="text-xs text-emerald-200/80 font-mono mt-1">
                CVE-2024-9999 neutralized. Memory isolation and cryptographic bounds validation engaged.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Packages Table */}
      <div className="rounded-2xl bg-[#08150e] border border-emerald-500/30 p-6 shadow-solar-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Software Dependency Inventory
          </h2>
          <span className="text-xs font-mono text-emerald-400">
            {sbomPackages.length} Discovered Components
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-emerald-500/20 text-zinc-400 uppercase text-[11px]">
                <th className="py-3 px-3">Package Name</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Component Role</th>
                <th className="py-3 px-3">CVE Status</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Security Badge</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10">
              {sbomPackages.map((pkg) => {
                const isThisVulnerable = pkg.id === "sensor-data-parser" && pkg.status === "VULNERABLE";
                return (
                  <tr
                    key={pkg.id}
                    className={cn(
                      "transition-colors",
                      isThisVulnerable
                        ? "bg-red-950/40 hover:bg-red-950/60"
                        : "hover:bg-emerald-950/20"
                    )}
                  >
                    <td className="py-3 px-3">
                      <span className={cn("font-bold text-sm", isThisVulnerable ? "text-red-300" : "text-white")}>
                        {pkg.name}
                      </span>
                      <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{pkg.description}</p>
                    </td>

                    <td className="py-3 px-3">
                      <span className={cn(
                        "font-semibold px-2 py-0.5 rounded text-xs",
                        isThisVulnerable ? "bg-red-900 text-red-200" : "bg-emerald-950 text-emerald-300"
                      )}>
                        v{pkg.version}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-zinc-300 text-[11px]">{pkg.component}</td>

                    <td className="py-3 px-3">
                      {pkg.cve ? (
                        <span className="font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-600/50">
                          {pkg.cve}
                        </span>
                      ) : (
                        <span className="text-zinc-500">None Disclosed</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                          pkg.severity === "CRITICAL"
                            ? "bg-red-600 text-white animate-pulse"
                            : "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                        )}
                      >
                        {pkg.severity}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {pkg.status === "VULNERABLE" ? (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-red-600 text-white border border-red-400 shadow-alert-glow uppercase">
                          FAIL (CVE-2024-9999)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-emerald-500 text-emerald-950 border border-emerald-400 shadow-solar-glow uppercase flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          PASS
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {pkg.id === "sensor-data-parser" && isThisVulnerable && (
                        <button
                          onClick={() => handlePatch(pkg.id)}
                          disabled={patching !== null}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider border border-red-400 shadow transition-all hover:scale-105"
                        >
                          {patching === pkg.id ? "Patching..." : "Patch to v1.2.1"}
                        </button>
                      )}
                      {pkg.id === "sensor-data-parser" && !isThisVulnerable && (
                        <span className="text-[11px] text-emerald-400 font-bold">
                          ✓ Mitigated
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

