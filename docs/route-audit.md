# Project Jatayu — API & Frontend Route Audit

**Audit Date:** October 2026  
**Scope:** All API Endpoints & Client-Side Navigation Views  

---

## 1. Backend REST API Endpoints

| Endpoint | Method | Purpose | Auth Required | Rate Limit | Input Validation | Error Handling | Status |
|---|---|---|---|---|---|---|---|
| `/api/health` | `GET` | Service liveness & readiness check | No | 100/min | None | Standard JSON | ✅ Verified |
| `/api/auth/login` | `POST` | Authenticate user, issue JWT Bearer token | No | 20/min | Pydantic Schema (`username`, `password`) | Generic 401 on bad credentials | ✅ Verified |
| `/api/dashboard/summary` | `GET` | Fleet KPIs, availability trends, risk distribution | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |
| `/api/fleet` | `GET` | Filtered list of fleet airframes | Yes (JWT) | 100/min | `status` whitelist, `type` regex, `search` max 100 | Clean 400 on invalid query params | ✅ Verified |
| `/api/fleet/summary` | `GET` | Fleet-wide counts by operational status | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |
| `/api/fleet/availability-trend`| `GET` | 30-day historical availability percentage | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |
| `/api/aircraft` | `GET` | List all aircraft overview rows | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |
| `/api/aircraft/{aircraft_id}` | `GET` | Detailed airframe digital twin, components & latest prediction | Yes (JWT) | 100/min | `aircraft_id` regex `[A-Za-z0-9]{1,20}` | 400 on malformed ID, 404 on not found | ✅ Verified |
| `/api/aircraft/{aircraft_id}/sensors` | `GET` | Time-series telemetry readings for charts | Yes (JWT) | 100/min | `limit: Query(ge=1, le=200)` | 422 on out-of-bounds limit | ✅ Verified |
| `/api/aircraft/{aircraft_id}/maintenance` | `GET` | Historical maintenance work orders | Yes (JWT) | 100/min | `aircraft_id` regex | 400/404 | ✅ Verified |
| `/api/aircraft/{aircraft_id}/components` | `GET` | Subsystem component health & cycle counts | Yes (JWT) | 100/min | `aircraft_id` regex | 400/404 | ✅ Verified |
| `/api/predict/{aircraft_id}` | `POST` | Execute ML models (Anomaly + Risk + RUL + SHAP) | Yes (JWT) | 20/min | `component_type` validation | 404 if airframe not found, sanitized 500 | ✅ Verified |
| `/api/predictions` | `GET` | Prognostic diagnostic log across assets | Yes (JWT) | 100/min | `risk_level` filter | Global handler | ✅ Verified |
| `/api/maintenance/queue` | `GET` | Pending work orders sorted by urgency | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |
| `/api/maintenance/recommendations` | `GET` | Prescriptive actions for at-risk airframes | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |
| `/api/maintenance/optimize` | `POST` | Google OR-Tools CP-SAT scheduler optimization | Yes (JWT) | 10/min | None | Returns greedy fallback if infeasible | ✅ Verified |
| `/api/spares` | `GET` | Warehouse part inventories across bases | Yes (JWT) | 100/min | `status` max length 50 | Global handler | ✅ Verified |
| `/api/spares/shortages` | `GET` | Part SKUs below safety stock | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |
| `/api/spares/reserve` | `POST` | Reserve spare part for work order | Yes (JWT) | 100/min | Pydantic schema validation | 404 if stock depleted | ✅ Verified |
| `/api/simulation/state` | `GET` | Current telemetry scenario injection state | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |
| `/api/simulation/start` | `POST` | Start simulation scenario | Yes (JWT) | 100/min | Pydantic schema | Global handler | ✅ Verified |
| `/api/simulation/step` | `POST` | Advance simulation by 1 telemetry cycle | Yes (JWT) | 30/min | Pydantic schema | Global handler | ✅ Verified |
| `/api/simulation/reset` | `POST` | Reset simulation back to nominal state | Yes (JWT) | 100/min | Pydantic schema | Global handler | ✅ Verified |
| `/api/alerts` | `GET` | Active system and telemetry threshold alerts | Yes (JWT) | 100/min | `severity`, `unread_only` filters | Global handler | ✅ Verified |
| `/api/alerts/{alert_id}/acknowledge` | `PATCH` | Acknowledge active alert | Yes (JWT) | 100/min | Alert ID validation | 404 if alert not found | ✅ Verified |
| `/api/models/metrics` | `GET` | Performance evaluation metrics for ML models | Yes (JWT) | 100/min | None | Global handler | ✅ Verified |

---

## 2. Frontend Client Routes

| View Key | Title | Dynamic Head Title | Mobile Drawer Nav | Error Boundary | Empty State | Success Toast | Status |
|---|---|---|---|---|---|---|---|
| `login` | Login | `Login \| AeroReady AI` | N/A | Global | N/A | Toast on error | ✅ Verified |
| `overview` | Fleet Availability Overview | `AeroReady AI — Fleet Availability Overview \| Jatayu` | Yes | Wrapped | `ApiError` card | Toast on quick sim | ✅ Verified |
| `fleet` | Fleet Asset Directory | `Fleet Overview \| AeroReady AI` | Yes | Wrapped | `EmptyState` component | N/A | ✅ Verified |
| `aircraft` | Aircraft Digital Twin | `Aircraft {ID} \| AeroReady AI` | Yes | Wrapped | `ApiError` card | Toast on inference | ✅ Verified |
| `predictions` | AI Prognostics Center | `Predictions Center \| AeroReady AI` | Yes | Wrapped | `EmptyState` component | N/A | ✅ Verified |
| `maintenance`| Maintenance Planner | `Maintenance Planner \| AeroReady AI` | Yes | Wrapped | `EmptyState` component | Toast on optimize | ✅ Verified |
| `spares` | Logistics & Spares | `Logistics & Spares \| AeroReady AI` | Yes | Wrapped | `EmptyState` component | Toast on reserve | ✅ Verified |
| `simulation` | Prognostic Simulation Lab | `Simulation Lab \| AeroReady AI` | Yes | Wrapped | Inline error | Toast on step/reset | ✅ Verified |
| `models` | Model Performance | `Model Performance \| AeroReady AI` | Yes | Wrapped | `ApiError` card | N/A | ✅ Verified |
| `alerts` | Alerts & Actions | `Alerts & Actions \| AeroReady AI` | Yes | Wrapped | `EmptyState` component | Toast on ack | ✅ Verified |
| `settings` | System Architecture | `System Architecture & Settings \| AeroReady AI` | Yes | Wrapped | Static docs | N/A | ✅ Verified |
| `*` (404) | 404 Not Found | Default title | Yes | Wrapped | Custom 404 screen | N/A | ✅ Verified |
