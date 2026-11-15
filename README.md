# SOLAR SENTINELS - Secure Energy Monitoring & Net Metering Cockpit

A high-assurance Next.js 14 cybersecurity and solar telemetry monitoring platform featuring an industrial dark aesthetic with emerald green solar glow, Tailwind CSS, Lucide icons, and Recharts.

---

## 🌟 Key Features & Requirements Matrix

| Module | Route | Key Capabilities & Verification |
| :--- | :--- | :--- |
| **Landing & Onboarding** | `/` | Cyber-grid landing page. Displays on-load modal: *"Welcome to Solar Sentinels - Secure Energy Monitoring"* with **"Click to Continue"** redirecting to `/login`. |
| **Authentication** | `/login` | Fixed Single Admin (`admin@solar.local` / `Admin@123`). Registration disabled. Rejection toast *"Wrong ID or Password - Only Admin Access Allowed"*. Persists `isAdminLoggedIn=true` in `localStorage`. |
| **Cockpit Dashboard** | `/dashboard` | **KPIs**: Generated Today, Consumed, Excess, Earned PKR.<br>**4 Sensor Cards**: Voltage (V), Current (A), Temp (°C), Efficiency (%) updating every 3s.<br>**Simulate MITM Attack Button**: freezes interval, displays RED BANNER + POPUP *"🚨 CRITICAL: MITM Attack Detected! Sensor Data Manipulated! Displaying FILTERED DATA. System Paused."*, blurs sensor cards with *"FILTERED DATA - UNTRUSTED"*, auto-freezes sell & wallet transactions.<br>**Restart Button**: Restores verified telemetry & logs event. |
| **Grid Energy Trading** | `/sell` | Sells surplus electricity to **K-Electric Net-Metering Pool @ 25 PKR/kWh**. Blocks order immediately if `isSensorCompromised` or `isEmergencyLocked` is active. |
| **Financial Treasury** | `/wallet` | Live PKR balance, weekly generation & revenue Recharts bar chart, and cryptographic transaction audit trail. Frozen when quarantine active. |
| **C1: SBOM Security** | `/security/sbom` | CycloneDX dependency inventory. Flags `sensor-data-parser@1.2.0` with **CVE-2024-9999 RCE CRITICAL**. Interactive **"Patch to v1.2.1"** button instantly transforms vulnerability badge into verified **PASS**. |
| **C2: Race Condition Test** | `/security/stress-test` | Simulates 30 parallel concurrent sell requests protected by an in-memory atomic mutex lock. Guaranteed Result: **Success: 1, Blocked: 29, Duplicate: 0**. |
| **C3: Emergency Kill-Switch** | `/emergency` | Giant Red Button: **"ACTIVATE EMERGENCY KILL-SWITCH"**. Freezes all financial outflows, cuts grid export, keeps telemetry in **READ-ONLY** mode, and displays: **"Time to Freeze: 1.2s - VERIFIED UNDER 30s"** (IEC 62443 standard). |

---

## 🛡️ Default Fixed Admin Credentials

- **Identity**: `admin@solar.local`
- **Password**: `Admin@123`

---

## 🚀 Running the Project

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run in development mode
npm run dev

# 3. Or build & start production server
npm run build
npm start
```

The application runs on `http://localhost:3000`.

