"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSolar } from "@/context/SolarContext";
import { ShieldCheck } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdminLoggedIn } = useSolar();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check localStorage directly for immediate response on client
    const token = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn && token !== "true") {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [isAdminLoggedIn, router]);

  if (checking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shadow-solar-glow animate-pulse mb-4">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-xs font-mono text-emerald-400/80 tracking-widest uppercase">
          Verifying Sentinel Cryptographic Credentials...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

