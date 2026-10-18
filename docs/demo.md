# 🎯 Jatayu (AeroReady AI) — SIH Judge Demonstration Script

Follow this step-by-step presentation script to demonstrate the complete end-to-end capabilities of **Jatayu (AeroReady AI)** in under 5 minutes:

---

## The Presentation Narrative

> *"Problem Statement SIH 26249 addresses low aircraft availability caused by fragmented and reactive maintenance. Today, we demonstrate **Jatayu**, an intelligence platform that connects health-monitoring telemetry to proactive maintenance planning and resource optimization."*

---

## 20-Step Live Demonstration Flow

1. **Access Application:** Open `http://localhost:5173`.
2. **Login Credentials:** Enter `demo` / `demo` on the prototype login screen.
3. **Overview Command Dashboard:**
   - Highlight the **Fleet Availability KPI (80%)** and **Available Aircraft (40/50)**.
   - Point out the **14-day Availability Trend** and **Upcoming 4-Week Maintenance Forecast**.
4. **Identify At-Risk Asset:** Point to the **Top Risk Table** highlighting `A101` and `A116`.
5. **Open Digital Twin:** Click **Inspect Twin** on airframe `A101`.
6. **Airframe 2D Schematic:**
   - Point out the clean line-art airframe schematic.
   - Click on the **Engine Subsystem** hotspot; observe health updates to 88%.
   - Click back on the **Hydraulic Actuation** hotspot; observe health is degraded.
7. **Inspect Diagnostics:** Point out the **Failure Risk (88%)**, **RUL (16h)**, and **Isolation Forest Anomaly status**.
8. **Explainable AI (Why?):**
   - Direct attention to the **SHAP Feature Contribution Chart**.
   - Explain how rising vibration amplitude (+48%) and hydraulic pressure drops are the primary statistical drivers.
9. **Inspect Telemetry Bands:** Point out the historical sensor trend lines with baseline reference envelopes.
10. **Trigger Live Simulation:** In the header, click **Simulate Sensor Telemetry** (or **Live Simulation**).
11. **Observe Escalation:** Telemetry signals deteriorate step-by-step, updating the health score in real time.
12. **Alert Triggered:** Observe the critical alert badge escalation in the header bell icon.
13. **Navigate to Maintenance Planner:** Click **Maintenance Planner** in the sidebar.
14. **Inspect Queued Tasks:** Show `TASK-101` and `TASK-116` with technician conflict on `TECH-HYD-01`.
15. **Run Constraint Optimizer:** Click the **Run OR-Tools Optimizer** button.
16. **Show CP-SAT Result Banner:**
    - Show **OPTIMAL** status banner.
    - Show **Conflicts Resolved: 2**.
    - Show **Downtime Saved: -16.5 hours**.
    - Show **Projected Fleet Availability: 76% → 84% (+8% gain)**.
17. **Navigate to Logistics & Spares:** Click **Logistics & Spares** in the sidebar.
18. **Depot Shortage Alert:** Show that `SP-HYD-01` (Hydraulic Pump X-200) has 0 units at Base Alpha, but 3 units exist at Central Depot Charlie.
19. **Initiate Transfer:** Click **Initiate Transfer & Reserve**; observe green confirmation banner.
20. **Reset Simulation:** In the top header, click the **Reset Simulation** button to return `A101` to its nominal baseline.
