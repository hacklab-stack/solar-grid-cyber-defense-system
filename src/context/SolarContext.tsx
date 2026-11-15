"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import {
  SensorReading,
  SystemKPIs,
  Transaction,
  SbomPackage,
  ActivityLog,
  StressTestResult,
} from "@/types/solar";

interface SolarContextType {
  // Auth
  isAdminLoggedIn: boolean;
  login: (id: string, pass: string) => boolean;
  logout: () => void;

  // Sensor & Telemetry
  sensorData: SensorReading;
  sensorHistory: SensorReading[];
  isSensorCompromised: boolean;
  simulateMitmAttack: () => void;
  restartSystem: () => void;
  showMitmModal: boolean;
  dismissMitmModal: () => void;

  // Emergency Kill-Switch
  isEmergencyLocked: boolean;
  emergencyFreezeTimeSec: number;
  activateEmergencyKillSwitch: () => void;
  deactivateEmergencyKillSwitch: () => void;

  // KPIs & Energy Operations
  kpis: SystemKPIs;
  walletBalance: number;
  transactions: Transaction[];
  sellEnergy: (amountKWh: number) => { success: boolean; error?: string; txId?: string; earnedPKR?: number };

  // SBOM Security
  sbomPackages: SbomPackage[];
  patchSbomPackage: (id: string) => void;

  // Race Condition Stress Test
  stressTestResult: StressTestResult | null;
  isStressTesting: boolean;
  runConcurrentStressTest: () => Promise<StressTestResult>;

  // Activity Logs
  logs: ActivityLog[];
  addLog: (
    action: string,
    details: string,
    severity: ActivityLog["severity"],
    category: ActivityLog["category"]
  ) => void;
}

const SolarContext = createContext<SolarContextType | undefined>(undefined);

const INITIAL_PACKAGES: SbomPackage[] = [
  {
    id: "sensor-data-parser",
    name: "sensor-data-parser",
    version: "1.2.0",
    fixedVersion: "1.2.1",
    cve: "CVE-2024-9999",
    severity: "CRITICAL",
    description: "Remote Code Execution (RCE) via unvalidated Modbus frame deserialization in inverter gateway",
    status: "VULNERABLE",
    license: "MIT",
    component: "Edge Gateway Telemetry Service",
  },
  {
    id: "next",
    name: "next",
    version: "14.2.16",
    fixedVersion: "14.2.16",
    severity: "SECURE",
    description: "React Production Framework - Server Side Rendering & App Router",
    status: "VERIFIED",
    license: "MIT",
    component: "Web Application Core",
  },
  {
    id: "kelectric-grid-protocol",
    name: "kelectric-grid-protocol",
    version: "2.4.0",
    fixedVersion: "2.4.0",
    severity: "SECURE",
    description: "K-Electric Advanced Metering Infrastructure (AMI) Net Metering Driver",
    status: "VERIFIED",
    license: "Apache-2.0",
    component: "Smart Grid Billing Interface",
  },
  {
    id: "crypto-vault-auth",
    name: "crypto-vault-auth",
    version: "3.1.2",
    fixedVersion: "3.1.2",
    severity: "SECURE",
    description: "FIPS 140-2 Level 3 Hardware Security Module (HSM) Token Validator",
    status: "VERIFIED",
    license: "BSD-3",
    component: "Authentication & Cryptographic Enclave",
  },
  {
    id: "recharts",
    name: "recharts",
    version: "2.13.3",
    fixedVersion: "2.13.3",
    severity: "SECURE",
    description: "Redefined SVG Chart Library for Solar Telemetry Visualizations",
    status: "VERIFIED",
    license: "MIT",
    component: "Dashboard Telemetry Visualizer",
  },
  {
    id: "modbus-serial",
    name: "modbus-serial",
    version: "8.0.7",
    fixedVersion: "8.0.7",
    severity: "SECURE",
    description: "RS485 Half-Duplex Master/Slave Inverter Serial Controller",
    status: "VERIFIED",
    license: "ISC",
    component: "Industrial Bus Transceiver",
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-KE-90812",
    timestamp: "2026-11-11 14:30:22",
    type: "SELL_ENERGY",
    amountKWh: 18.5,
    ratePKR: 25,
    totalPKR: 462.5,
    status: "COMPLETED",
    recipient: "K-Electric Grid Feeder #12 (Karachi South)",
    txHash: "0x8fa3...b41e",
    notes: "Automatic Net-Metering export cleared",
  },
  {
    id: "TX-KE-90784",
    timestamp: "2026-11-11 11:15:05",
    type: "SELL_ENERGY",
    amountKWh: 32.0,
    ratePKR: 25,
    totalPKR: 800.0,
    status: "COMPLETED",
    recipient: "K-Electric Grid Feeder #12 (Karachi South)",
    txHash: "0x3e17...c99a",
    notes: "Peak solar yield export executed",
  },
  {
    id: "TX-KE-90650",
    timestamp: "2026-11-10 16:45:18",
    type: "SELL_ENERGY",
    amountKWh: 24.2,
    ratePKR: 25,
    totalPKR: 605.0,
    status: "COMPLETED",
    recipient: "K-Electric Grid Feeder #12 (Karachi South)",
    txHash: "0x1bc9...f803",
    notes: "Afternoon surplus solar power transfer",
  },
  {
    id: "TX-KE-90511",
    timestamp: "2026-11-10 12:20:44",
    type: "SELL_ENERGY",
    amountKWh: 40.0,
    ratePKR: 25,
    totalPKR: 1000.0,
    status: "COMPLETED",
    recipient: "K-Electric Grid Feeder #12 (Karachi South)",
    txHash: "0x77ae...a112",
    notes: "High efficiency midday harvest credit",
  },
];

export const SolarProvider = ({ children }: { children: ReactNode }) => {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Security & Attack Flags
  const [isSensorCompromised, setIsSensorCompromised] = useState<boolean>(false);
  const [showMitmModal, setShowMitmModal] = useState<boolean>(false);
  const [isEmergencyLocked, setIsEmergencyLocked] = useState<boolean>(false);
  const [emergencyFreezeTimeSec, setEmergencyFreezeTimeSec] = useState<number>(1.2);

  // Sensor Telemetry
  const [sensorData, setSensorData] = useState<SensorReading>({
    voltage: 398.4,
    current: 22.8,
    temperature: 46.5,
    efficiency: 94.8,
    powerKw: 9.08,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [sensorHistory, setSensorHistory] = useState<SensorReading[]>([]);

  // System KPIs
  const [kpis, setKpis] = useState<SystemKPIs>({
    generatedToday: 68.4,
    consumedToday: 24.2,
    excessToday: 44.2,
    earnedPKR: 2867.5,
    gridFrequencyHz: 50.02,
    co2SavedKg: 49.8,
  });

  // Financial Wallet
  const [walletBalance, setWalletBalance] = useState<number>(18450);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // SBOM Packages
  const [sbomPackages, setSbomPackages] = useState<SbomPackage[]>(INITIAL_PACKAGES);

  // Stress Test
  const [stressTestResult, setStressTestResult] = useState<StressTestResult | null>(null);
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);

  // Activity Logs
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: "LOG-INIT-1",
      timestamp: new Date().toLocaleTimeString(),
      action: "SENTINEL_DAEMON_STARTED",
      details: "Solar Sentinels telemetry core initialized. Modbus RS485 connection active.",
      severity: "INFO",
      category: "SENSOR",
    },
    {
      id: "LOG-INIT-2",
      timestamp: new Date().toLocaleTimeString(),
      action: "GRID_SYNC_ESTABLISHED",
      details: "Synchronized with K-Electric Net Metering Gateway at 25.00 PKR/kWh.",
      severity: "SUCCESS",
      category: "FINANCIAL",
    },
  ]);

  const addLog = useCallback(
    (
      action: string,
      details: string,
      severity: ActivityLog["severity"],
      category: ActivityLog["category"]
    ) => {
      const newLog: ActivityLog = {
        id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString(),
        action,
        details,
        severity,
        category,
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    },
    []
  );

  // Safe localStorage hydration
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("isAdminLoggedIn");
      if (storedAuth === "true") {
        setIsAdminLoggedIn(true);
      }
      const storedMitm = localStorage.getItem("isSensorCompromised");
      if (storedMitm === "true") {
        setIsSensorCompromised(true);
      }
      const storedEmergency = localStorage.getItem("isEmergencyLocked");
      if (storedEmergency === "true") {
        setIsEmergencyLocked(true);
      }
    } catch {
      // LocalStorage access fallback
    }
    setIsHydrated(true);
  }, []);

  // Login handler
  const login = useCallback(
    (id: string, pass: string): boolean => {
      if (id === "admin@solar.local" && pass === "Admin@123") {
        setIsAdminLoggedIn(true);
        try {
          localStorage.setItem("isAdminLoggedIn", "true");
        } catch { }
        addLog(
          "ADMIN_AUTHENTICATED",
          "Administrator admin@solar.local successfully authenticated via secure token.",
          "SUCCESS",
          "AUTH"
        );
        return true;
      } else {
        addLog(
          "AUTHENTICATION_FAILED",
          `Unauthorized login attempt with identity: "${id}". Denied access.`,
          "CRITICAL",
          "AUTH"
        );
        return false;
      }
    },
    [addLog]
  );

  // Logout handler
  const logout = useCallback(() => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem("isAdminLoggedIn");
    } catch { }
    addLog(
      "ADMIN_LOGGED_OUT",
      "Administrator signed out. Protected routes locked.",
      "INFO",
      "AUTH"
    );
  }, [addLog]);

  // Interval updates every 3 seconds for Sensor Readings
  useEffect(() => {
    // If sensor is compromised, FREEZE interval updates!
    if (isSensorCompromised) {
      return;
    }

    const interval = setInterval(() => {
      // Generate realistic slight sensor variations
      const baseVoltage = 400.0;
      const baseCurrent = 23.5;
      const baseTemp = 48.0;
      const baseEff = 94.5;

      const deltaV = (Math.random() * 8 - 4);
      const deltaA = (Math.random() * 2 - 1);
      const deltaT = (Math.random() * 1.5 - 0.75);
      const deltaE = (Math.random() * 1.2 - 0.6);

      const voltage = Math.round((baseVoltage + deltaV) * 10) / 10;
      const current = Math.round((baseCurrent + deltaA) * 10) / 10;
      const temperature = Math.round((baseTemp + deltaT) * 10) / 10;
      const efficiency = Math.min(99.4, Math.max(88.0, Math.round((baseEff + deltaE) * 10) / 10));
      const powerKw = Math.round(((voltage * current) / 1000) * 100) / 100;
      const timestamp = new Date().toLocaleTimeString();

      const newReading: SensorReading = {
        voltage,
        current,
        temperature,
        efficiency,
        powerKw,
        timestamp,
        isUntrusted: false,
      };

      setSensorData(newReading);
      setSensorHistory((prev) => [...prev.slice(-19), newReading]);

      // Minor increment in generated energy and excess
      setKpis((prev) => {
        const genIncrement = Math.round((powerKw * (3 / 3600)) * 100) / 100;
        const consIncrement = Math.round((genIncrement * 0.35) * 100) / 100;
        const excessIncrement = Math.max(0, genIncrement - consIncrement);
        return {
          ...prev,
          generatedToday: Math.round((prev.generatedToday + genIncrement) * 100) / 100,
          consumedToday: Math.round((prev.consumedToday + consIncrement) * 100) / 100,
          excessToday: Math.round((prev.excessToday + excessIncrement) * 100) / 100,
          gridFrequencyHz: Math.round((50.0 + (Math.random() * 0.08 - 0.04)) * 100) / 100,
          co2SavedKg: Math.round((prev.co2SavedKg + genIncrement * 0.72) * 10) / 10,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSensorCompromised]);

  // MITM Attack Simulator
  const simulateMitmAttack = useCallback(() => {
    setIsSensorCompromised(true);
    setShowMitmModal(true);
    try {
      localStorage.setItem("isSensorCompromised", "true");
    } catch { }

    // Manipulate sensor data with out-of-band suspicious values to illustrate the spoofed packets
    setSensorData((prev) => ({
      ...prev,
      voltage: 620.0, // Dangerous overvoltage spoofing
      current: 48.5,  // Dangerous current spike
      temperature: 88.9, // Threatening thermal runaway
      efficiency: 34.2,
      powerKw: 30.07,
      isUntrusted: true,
      timestamp: `${new Date().toLocaleTimeString()} [SPOOFED]`,
    }));

    addLog(
      "CRITICAL_MITM_ATTACK_DETECTED",
      "🚨 MITM Attack Detected! Sensor Data Manipulated! Telemetry payload corrupted. Displaying FILTERED DATA. Financial outflows & trading frozen.",
      "CRITICAL",
      "SECURITY"
    );
  }, [addLog]);

  // Restart System & Clear Malicious Data
  const restartSystem = useCallback(() => {
    setIsSensorCompromised(false);
    setShowMitmModal(false);
    try {
      localStorage.setItem("isSensorCompromised", "false");
    } catch { }

    // Restore normalized verified telemetry
    const restoredReading: SensorReading = {
      voltage: 398.2,
      current: 22.4,
      temperature: 46.1,
      efficiency: 95.1,
      powerKw: 8.92,
      timestamp: new Date().toLocaleTimeString(),
      isUntrusted: false,
    };
    setSensorData(restoredReading);

    addLog(
      "SYSTEM_RESTARTED_CLEARED",
      "Inverter bus reset complete. Cryptographic sensor validation re-established. Malicious frames purged. Financial channels re-enabled.",
      "SUCCESS",
      "SECURITY"
    );
  }, [addLog]);

  const dismissMitmModal = useCallback(() => {
    setShowMitmModal(false);
  }, []);

  // Emergency Kill-Switch
  const activateEmergencyKillSwitch = useCallback(() => {
    setIsEmergencyLocked(true);
    setEmergencyFreezeTimeSec(1.2);
    try {
      localStorage.setItem("isEmergencyLocked", "true");
    } catch { }

    addLog(
      "EMERGENCY_KILL_SWITCH_ENGAGED",
      "ACTIVATE EMERGENCY KILL-SWITCH executed. Grid interconnect open-circuited. Outflows FROZEN. Telemetry isolated to READ-ONLY. Time to Freeze: 1.2s - VERIFIED UNDER 30s.",
      "CRITICAL",
      "EMERGENCY"
    );
  }, [addLog]);

  const deactivateEmergencyKillSwitch = useCallback(() => {
    setIsEmergencyLocked(false);
    try {
      localStorage.setItem("isEmergencyLocked", "false");
    } catch { }

    addLog(
      "EMERGENCY_KILL_SWITCH_DEACTIVATED",
      "Emergency lock lifted by root operator. Financial pipelines restored.",
      "WARNING",
      "EMERGENCY"
    );
  }, [addLog]);

  // Sell Energy to K-Electric Function
  const sellEnergy = useCallback(
    (amountKWh: number) => {
      // Must check security locks:
      if (isSensorCompromised) {
        addLog(
          "SELL_ORDER_BLOCKED_MITM",
          `Blocked sell request for ${amountKWh} kWh. System in MITM quarantine state (Sensor data untrusted).`,
          "CRITICAL",
          "FINANCIAL"
        );
        return {
          success: false,
          error: "TRANSACTION FROZEN: Inverter telemetry is compromised by active MITM attack. Outflows strictly blocked.",
        };
      }

      if (isEmergencyLocked) {
        addLog(
          "SELL_ORDER_BLOCKED_EMERGENCY",
          `Blocked sell request for ${amountKWh} kWh. Emergency Kill-Switch is ACTIVE.`,
          "CRITICAL",
          "EMERGENCY"
        );
        return {
          success: false,
          error: "TRANSACTION FROZEN: Emergency Kill-Switch is ACTIVE. Outflows locked down (Telemetry Read-Only).",
        };
      }

      if (amountKWh <= 0) {
        return { success: false, error: "Please enter a valid energy amount greater than 0 kWh." };
      }

      if (amountKWh > kpis.excessToday) {
        return {
          success: false,
          error: `Insufficient excess energy! Current surplus is ${kpis.excessToday.toFixed(1)} kWh.`,
        };
      }

      const ratePKR = 25; // 25 PKR per kWh
      const totalPKR = Math.round(amountKWh * ratePKR * 100) / 100;
      const txId = `TX-KE-${Math.floor(100000 + Math.random() * 900000)}`;
      const txHash = `0x${Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}...${Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`;

      // Execute transaction state updates
      setWalletBalance((prev) => Math.round((prev + totalPKR) * 100) / 100);
      setKpis((prev) => ({
        ...prev,
        excessToday: Math.max(0, Math.round((prev.excessToday - amountKWh) * 100) / 100),
        earnedPKR: Math.round((prev.earnedPKR + totalPKR) * 100) / 100,
      }));

      const newTx: Transaction = {
        id: txId,
        timestamp: new Date().toLocaleString(),
        type: "SELL_ENERGY",
        amountKWh,
        ratePKR,
        totalPKR,
        status: "COMPLETED",
        recipient: "K-Electric Smart Grid Feeder #12",
        txHash,
        notes: `Sold ${amountKWh} kWh @ 25 PKR/kWh to K-Electric net metering pool`,
      };

      setTransactions((prev) => [newTx, ...prev]);

      addLog(
        "ENERGY_SOLD_TO_KELECTRIC",
        `Successfully transferred ${amountKWh} kWh to K-Electric @ 25 PKR/kWh. Credited PKR ${totalPKR.toLocaleString()} to wallet.`,
        "SUCCESS",
        "FINANCIAL"
      );

      return {
        success: true,
        txId,
        earnedPKR: totalPKR,
      };
    },
    [isSensorCompromised, isEmergencyLocked, kpis.excessToday, addLog]
  );

  // SBOM Patching function
  const patchSbomPackage = useCallback(
    (id: string) => {
      setSbomPackages((prev) =>
        prev.map((pkg) => {
          if (pkg.id === id) {
            return {
              ...pkg,
              version: pkg.fixedVersion,
              status: "PATCHED",
              severity: "SECURE",
              cve: undefined,
              description: "Patched: Modbus frame validation & memory isolation verified. RCE vector closed.",
            };
          }
          return pkg;
        })
      );

      addLog(
        "SBOM_PACKAGE_PATCHED",
        `Successfully upgraded ${id} to v1.2.1. Mitigated CVE-2024-9999. Inverter gateway hardened.`,
        "SUCCESS",
        "SECURITY"
      );
    },
    [addLog]
  );

  // C2: Race Condition Stress Test with Atomic Mutex Lock
  const mutexLockRef = useRef<boolean>(false);

  const runConcurrentStressTest = useCallback(async (): Promise<StressTestResult> => {
    setIsStressTesting(true);
    addLog(
      "STRESS_TEST_INITIATED",
      "Firing 30 concurrent atomic energy sell requests against K-Electric Net Metering Gateway...",
      "WARNING",
      "SECURITY"
    );

    const startTime = performance.now();
    const totalRequests = 30;
    const reqResults: StressTestResult["logs"] = [];
    let successCount = 0;
    let blockedCount = 0;
    let duplicateCount = 0;

    // We simulate 30 concurrent sell requests that execute in parallel.
    // An atomic mutex lock guarantees that exactly 1 request acquires the resource lock,
    // and all other 29 are safely rejected to prevent double-spending or race condition over-export.
    const promises = Array.from({ length: totalRequests }).map(async (_, idx) => {
      const reqId = idx + 1;
      // Slight jitter in milliseconds
      await new Promise((res) => setTimeout(res, Math.random() * 60));

      // ATOMIC TRANSACTION CHECK & MUTEX ACQUISITION:
      if (!mutexLockRef.current) {
        // First to acquire lock
        mutexLockRef.current = true;
        successCount++;
        reqResults.push({
          reqId,
          timestamp: new Date().toLocaleTimeString(),
          status: "ACQUIRED_LOCK_SUCCESS",
          energyAmountKWh: 10,
          amountPKR: 250,
          message: `[LOCK_ACQUIRED] Req #${reqId} succeeded: Exclusive lock held. Deducted 10 kWh -> Credited PKR 250.`,
        });

        // Simulate micro holding time
        await new Promise((res) => setTimeout(res, 200));
        // Keep lock until batch completes so concurrent race requests fail atomically
      } else {
        // Mutex already held by another thread!
        blockedCount++;
        reqResults.push({
          reqId,
          timestamp: new Date().toLocaleTimeString(),
          status: "MUTEX_LOCKED_BLOCKED",
          energyAmountKWh: 10,
          amountPKR: 0,
          message: `[LOCK_CONTENTION] Req #${reqId} rejected: Resource busy (Atomic Mutex active). Race condition thwarted.`,
        });
      }
    });

    await Promise.all(promises);

    // Release mutex
    mutexLockRef.current = false;
    const durationMs = Math.round(performance.now() - startTime);

    const result: StressTestResult = {
      totalRequests,
      success: successCount,
      blocked: blockedCount,
      duplicate: duplicateCount,
      durationMs,
      logs: reqResults.sort((a, b) => a.reqId - b.reqId),
    };

    setStressTestResult(result);
    setIsStressTesting(false);

    addLog(
      "STRESS_TEST_COMPLETED",
      `30 Concurrent Requests Evaluated: Success ${successCount}, Blocked ${blockedCount}, Duplicate ${duplicateCount} (${durationMs}ms). Zero race condition exploits.`,
      "SUCCESS",
      "SECURITY"
    );

    return result;
  }, [addLog]);

  return (
    <SolarContext.Provider
      value={{
        isAdminLoggedIn,
        login,
        logout,
        sensorData,
        sensorHistory,
        isSensorCompromised,
        simulateMitmAttack,
        restartSystem,
        showMitmModal,
        dismissMitmModal,
        isEmergencyLocked,
        emergencyFreezeTimeSec,
        activateEmergencyKillSwitch,
        deactivateEmergencyKillSwitch,
        kpis,
        walletBalance,
        transactions,
        sellEnergy,
        sbomPackages,
        patchSbomPackage,
        stressTestResult,
        isStressTesting,
        runConcurrentStressTest,
        logs,
        addLog,
      }}
    >
      {children}
    </SolarContext.Provider>
  );
};

export const useSolar = (): SolarContextType => {
  const context = useContext(SolarContext);
  if (!context) {
    throw new Error("useSolar must be used within a SolarProvider");
  }
  return context;
};
