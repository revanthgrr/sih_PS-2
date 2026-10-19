# 🏛️ Jatayu AI — System Architecture

**Team:** TrackForce  
**Organization:** Ministry of Defence | Department: Defence Services Staff College  
**Theme:** Transportation & Logistics  

---

## 1. High-Level Concept

The central operational doctrine of Jatayu is:

$$\text{Detect} \longrightarrow \text{Predict} \longrightarrow \text{Explain} \longrightarrow \text{Plan} \longrightarrow \text{Optimize} \longrightarrow \text{Improve Fleet Availability}$$

Jatayu breaks down the traditional silo between health-monitoring sensors, technical logs, technician skills, and depot inventory into a unified decision-support platform.

---

## 2. Architectural Data Flow Diagram

```
Aircraft Sensor Telemetry (Temperature, Vibration, Pressures, RPM, Voltage)
  + Historical Maintenance Records
  + Component Health & Cycles
  + Spare Inventory & Depot Stock
  + Technician Skill Profiles & Workshop Bay Capacities
                     │
                     ▼
         Data Ingestion & Cleaning
                     │
                     ▼
            Feature Engineering
(Rolling Statistics, Rate of Change, Baseline Deviations, Trajectory Partitions)
                     │
                     ▼
                  ML Layer
    ├── Model A: Isolation Forest (Anomaly Isolation)
    ├── Model B: XGBoost Classifier (Failure Risk Probability in next 20h)
    └── Model C: XGBoost Regressor (Remaining Useful Life in Flight Hours)
                     │
                     ▼
         Explainable AI Layer (SHAP)
                     │
                     ▼
        Digital Twin & Health Score
                     │
                     ▼
         Maintenance Priority Engine
                     │
                     ▼
       Logistics & Spare Parts Routing
                     │
                     ▼
      OR-Tools CP-SAT Constraint Optimizer
 (Non-overlap, workshop bays, skill match, RUL deadline, lead time)
                     │
                     ▼
         Fleet Availability Projection
                     │
                     ▼
           FastAPI REST Backend
                     │
                     ▼
           React + TypeScript UI
```

---

## 3. Technology Stack

### Backend
- **FastAPI**: Asynchronous high-performance REST framework.
- **SQLAlchemy 2.0**: Relational ORM supporting SQLite out-of-the-box and PostgreSQL for enterprise deployment.
- **Pydantic v2**: Strict schema validation and serialized response models.
- **Uvicorn**: High-throughput ASGI production server.

### Machine Learning
- **Isolation Forest (`scikit-learn`)**: Unsupervised anomaly detection.
- **XGBoost Classifier & Regressor (`xgboost`)**: Supervised failure risk and RUL forecasting.
- **SHAP (`shap`)**: TreeExplainer feature attributions for transparent decision support.

### Optimization
- **Google OR-Tools (CP-SAT Solver)**: Constraint programming for finite resource allocation, workshop throughput, and downtime minimization.

### Frontend
- **React 18 + TypeScript**: Strict component typing.
- **Vite 6**: Fast bundling and hot module replacement.
- **Tailwind CSS v4**: Aerospace engineering light-theme design system.
- **Recharts**: Telemetry trends, donut charts, and Gantt horizon visualizations.
- **Lucide React**: Clean, lightweight technical line iconography.

---

## 4. Security, Scope & Safety Boundaries

1. **Non-Combat Scope:** No combat, weapon targeting, mission planning, or tactical navigation logic is implemented. The system strictly addresses fleet health, maintenance, and logistics availability.
2. **Data Provenance:** The prototype uses synthetic and open benchmark data (modeled after NASA C-MAPSS). No classified or operational defence data is exposed.
3. **Decision-Support Guardrails:** All automated schedules and alerts explicitly state that final sign-offs require human review by certified technical officers.
