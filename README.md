# 🛩️ Project Jatayu — Jatayu AI
### Predictive Maintenance & Fleet Availability Intelligence Platform
**Team:** TrackForce | **Category:** Software | **Theme:** Transportation & Logistics  

---

> [!NOTE]
> **Data Provenance & Safety Notice:**  
> Prototype uses public/synthetic aerospace data for demonstration. Real operational defence aircraft data is not used.
> The platform focuses strictly on asset health monitoring, predictive maintenance, logistics planning, and fleet availability decision support. No combat, weapon targeting, or offensive military capabilities are implemented.

---

## 1. Executive Summary & Core Problem

Military and aerospace fleet managers face reduced operational aircraft availability caused by fragmented and largely reactive maintenance practices. Maintenance data frequently exists in disparate silos:
- Real-time sensor and health telemetry
- Historical technical service logs and fault codes
- Component operational cycles and overhaul history
- Spare parts warehouse inventories and depot locations
- Technician skill certifications and maintenance workshop bay capacities

**Jatayu (Jatayu AI)** integrates these data sources into a unified aerospace command dashboard that operationalizes the full predictive maintenance lifecycle:

$$\textbf{Detect} \longrightarrow \textbf{Predict} \longrightarrow \textbf{Explain} \longrightarrow \textbf{Plan} \longrightarrow \textbf{Optimize} \longrightarrow \textbf{Improve Availability}$$

---

## 2. Key Capabilities & Technical Features

- **2D Line-Art Aircraft Digital Twin:** Interactive schematic with clickable subsystem hotspots (Engine, Hydraulic, Avionics, Fuel, Electrical) and real-time health diagnostics.
- **Unsupervised Anomaly Isolation:** Isolation Forest isolating multidimensional telemetry drift without requiring labeled failure records.
- **Supervised Failure Risk Prediction:** XGBoost Classifier predicting the probability of maintenance events within a configurable 20-hour operational horizon.
- **Remaining Useful Life (RUL) Regression:** XGBoost Regressor estimating remaining flight hours with confidence bounds.
- **Explainable AI (SHAP):** Local factor attribution charts answering **"Why was this alert generated?"** for technical officers.
- **Deterministic Priority Engine:** Weighted scoring prioritizing tasks by failure probability, RUL urgency, and system criticality.
- **Depot Logistics & Shortage Routing:** Automated detection of stock shortages with inter-depot transfer recommendations.
- **OR-Tools CP-SAT Constraint Optimization:** Solves finite-resource scheduling under technician non-overlap, workshop bay limits, and RUL deadlines, quantifying downtime reduction and availability gains.
- **Interactive Simulation Lab:** 5 preset operational scenarios (Nominal, Progressive Sensor Degradation, Spare Shortage, Resource Bottleneck, Fleet Recovery) and live step-by-step telemetry degradation.

---

## 3. System Architecture

```
Aircraft Sensor Telemetry ────┐
Historical Maintenance Logs ──┼──► Ingestion & Feature Engineering (Rolling Stats, Slopes, Deviations)
Component Health & Cycles ────┤
Depot Spare Parts Inventory ──┤   ML Prognostics Layer:
Technician Skills & Bays ─────┘   ├── Isolation Forest (Anomaly Isolation)
                                  ├── XGBoost Classifier (Failure Risk Probability in next 20h)
                                  └── XGBoost Regressor (Remaining Useful Life in Flight Hours)
                                          │
                                          ▼
                                Explainable AI (SHAP)
                                          │
                                          ▼
                              2D Digital Twin & Health Score
                                          │
                                          ▼
                               Priority & Logistics Engines
                                          │
                                          ▼
                         Google OR-Tools CP-SAT Optimizer
                                          │
                                          ▼
                              Projected Fleet Availability
                                          │
                                          ▼
                            FastAPI REST ◄──► React TypeScript
```

---

## 4. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 6, Tailwind CSS v4, Lucide React, Recharts, Axios |
| **Backend** | Python 3.14 / 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Uvicorn |
| **Database** | SQLite (default development), PostgreSQL-ready via `DATABASE_URL` |
| **Machine Learning** | Scikit-learn, XGBoost, SHAP, NumPy, Pandas, Joblib |
| **Optimization** | Google OR-Tools (CP-SAT Solver) |
| **Testing** | Pure Python TestClient integration suite & Browser QA subagent |

---

## 5. Quick Startup (Windows PowerShell)

### Launch Both Servers with One Command:
```powershell
.\run_all.ps1
```
This script launches the FastAPI backend on port 8000, the Vite frontend on port 5173, and opens your browser automatically.

---

## 6. Manual Setup & Installation

### Step 1: Initialize Database & Seed Data
```powershell
python backend/scripts/seed_data.py
```
*Initializes 50 aircraft, 250 components, ~1,250 sensor telemetry rows, 120 maintenance records, 12 spares, 4 workshops, and 10 certified technicians.*

### Step 2: Train Machine Learning Pipeline
```powershell
python backend/app/ml/training/train_all.py
```
*Trains Isolation Forest, XGBoost Classifier, and XGBoost Regressor with strictly grouped trajectory partitioning to prevent data leakage. Saves artifacts to `backend/models/`.*

### Step 3: Run Backend Server
```powershell
# From root directory:
.\run_backend.ps1
# Or manually:
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Step 4: Run Frontend Server
```powershell
# From root directory:
.\run_frontend.ps1
# Or manually:
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Dashboard will be live at: [http://localhost:5173](http://localhost:5173)

---

## 7. Authentication & Security Architecture

The platform features an enterprise-grade defense-in-depth security configuration:
- **Authentication:** JWT Bearer token authentication on all operational routes with constant-time password hash verification (`bcrypt`).
- **Token Security:** Tokens are maintained in React in-memory state (never `localStorage`) preventing cross-site scripting (XSS) token theft.
- **Access Control:** Automatic route guards; public endpoints strictly isolated to `/api/health` and `/api/auth/login`.
- **API Security:** In-memory rate limiting across inference and scheduling endpoints; strict CORS whitelist (no wildcards); security headers (`nosniff`, `DENY`, `strict-origin`).
- **Audit Documentation:** Full security, mobile, route, and production audits available in [`docs/`](file:///d:/Jatayu/Software/docs/):
  - [Security Audit Report](file:///d:/Jatayu/Software/docs/security-audit.md)
  - [API & Route Audit](file:///d:/Jatayu/Software/docs/route-audit.md)
  - [Mobile & Adaptive UX Audit](file:///d:/Jatayu/Software/docs/mobile-audit.md)
  - [Production Readiness Checklist](file:///d:/Jatayu/Software/docs/production-readiness.md)

### Demo Credentials:
- **Username:** `demo`
- **Password:** `demo`
*(Configurable via `DEMO_USERNAME` and `DEMO_PASSWORD` environment variables).*

---

## 8. Verification & Test Suite

Run the complete backend integration and security test suite:
```powershell
python tests/backend/test_api.py
```
**Test Results:** **17/17 passed**
- `test_health` — Public health probe
- `test_auth_required` — Unauthenticated requests rejected with 401
- `test_invalid_login` — Invalid credentials rejected with 401
- `test_valid_login` — Valid credentials issue signed JWT Bearer token
- `test_security_headers` — Response headers (`nosniff`, `DENY`, `strict-origin`) verified
- `test_invalid_aircraft_id` — Path traversal and malicious airframe IDs rejected
- `test_sensor_limit_bounds` — Excessive query parameters rejected with 422
- `test_status_filter_validation` — Query parameter injection rejected with 400
- `test_dashboard_summary` — Fleet KPIs and availability trend
- `test_fleet_endpoints` — Asset directory and summary counts
- `test_aircraft_detail_and_sensors` — Airframe digital twin and telemetry streams
- `test_prediction_endpoint` — Multi-model ML inference (Anomaly + Risk + RUL + SHAP)
- `test_spares_and_shortages` — Depot inventory and critical shortages
- `test_maintenance_optimizer` — Google OR-Tools CP-SAT scheduler optimization
- `test_simulation_cycle` — Prognostic scenario step and reset
- `test_alerts` — Subsystem threshold and prognostic alert dispatch
- `test_model_metrics` — Isolation Forest & XGBoost validation metrics

---

## 9. Limitations & Ethical Guardrails

1. **Non-Operational Data:** Real operational military aircraft data is not used. Synthetic telemetry benchmarked on public prognostics patterns (e.g. NASA C-MAPSS) is used.
2. **Decision-Support Scope:** Recommendations are indicative. Certified maintenance engineers must verify and sign off on all airframe work orders and flight releases.
3. **No Tactical/Offensive Logic:** Developed exclusively for maintenance planning, logistics optimization, and fleet readiness.
