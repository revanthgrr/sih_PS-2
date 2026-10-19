# 📊 Jatayu AI — Data Strategy & Dataset Provenance

---

## 1. Compliance & Security Notice

> **"Prototype uses public/synthetic aerospace data for demonstration. Real operational defence aircraft data is not used."**

Jatayu was engineered strictly to comply with Ministry of Defence data safety requirements. Sensitive operational telemetry, mission locations, and tactical fleet parameters are never requested, stored, or simulated.

---

## 2. Deterministic Seed Generation

All demonstration data is seeded with a deterministic pseudorandom seed:
```python
RANDOM_SEED = 42
```
This guarantees that judges and evaluators experience identical reproducible behavior during presentations.

---

## 3. Fleet Composition (50 Airframes)

| Aircraft Category | Count | Primary Operational Role |
|---|---|---|
| **Tactical Transport** | 15 | Mid-range logistics airlift |
| **Heavy Transport** | 12 | Strategic heavy freight |
| **Rotary Utility** | 8 | Utility and tactical casualty transport |
| **Maritime Patrol** | 8 | Long-range coastal search & rescue |
| **Advanced Jet Trainer** | 4 | Lead-in flight training |
| **Light Utility** | 3 | Base courier & communication |

---

## 4. Five Embedded Scenarios

1. **Scenario A (Airframes A101–A115):** Nominal Healthy Fleet. Stable harmonics, normal pressure, high health score (&gt;90%).
2. **Scenario B (Airframes A116–A125):** Progressive Sensor Degradation. Vibration slope rising, hydraulic pressure declining, low RUL (&lt;20h).
3. **Scenario C (Airframes A126–A132):** Logistics Spare Shortage. Local inventory at Base Alpha is depleted (0 units); alternative available at Central Depot Charlie.
4. **Scenario D (Airframes A133–A145):** Resource & Technician Bottleneck. Concurrent maintenance due with technician skill contention.
5. **Scenario E (Airframes A146–A150):** Post-Maintenance Fleet Recovery. Demonstrates airframe health recovery and return to active available status.
