export interface SensorReading {
  voltage: number;      // Volts (V)
  current: number;      // Amperes (A)
  temperature: number;  // Celsius (°C)
  efficiency: number;   // Percentage (%)
  powerKw: number;      // Kilowatts (kW)
  timestamp: string;
  isUntrusted?: boolean;
}

export interface SystemKPIs {
  generatedToday: number; // kWh
  consumedToday: number;  // kWh
  excessToday: number;    // kWh
  earnedPKR: number;      // PKR
  gridFrequencyHz: number;// 50.0 Hz
  co2SavedKg: number;
}

export interface Transaction {
  id: string;
  timestamp: string;
  type: 'SELL_ENERGY' | 'DEPOSIT' | 'WITHDRAWAL' | 'REBATE';
  amountKWh: number;
  ratePKR: number;
  totalPKR: number;
  status: 'COMPLETED' | 'FROZEN_MITM' | 'FROZEN_EMERGENCY' | 'BLOCKED_RACE_CONDITION';
  recipient: string;
  txHash: string;
  notes?: string;
}

export interface SbomPackage {
  id: string;
  name: string;
  version: string;
  fixedVersion: string;
  cve?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SECURE';
  description: string;
  status: 'VULNERABLE' | 'PATCHED' | 'VERIFIED';
  license: string;
  component: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  category: 'AUTH' | 'SENSOR' | 'SECURITY' | 'FINANCIAL' | 'EMERGENCY';
}

export interface StressTestResult {
  totalRequests: number;
  success: number;
  blocked: number;
  duplicate: number;
  durationMs: number;
  logs: {
    reqId: number;
    timestamp: string;
    status: 'ACQUIRED_LOCK_SUCCESS' | 'MUTEX_LOCKED_BLOCKED' | 'DENIED_DUPLICATE';
    energyAmountKWh: number;
    amountPKR: number;
    message: string;
  }[];
}

