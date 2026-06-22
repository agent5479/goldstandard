# CareMarshall demosuite — archived feature matrix

The local `demosuite/` folder was a **CareMarshall** reference app used to scaffold `trainer-app/`. It was **gitignored** and kept only on developer machines. Before deletion, keep your own zip backup of `demosuite/app/` (and `demosuite/docs/` if present).

**Canonical app:** [`trainer-app/`](../trainer-app/) — all new work goes there.

**Archive date:** June 2026 · trainer-app canonical from commit `cc77fc0` onward.

---

## Domain mapping

| demosuite (care) | trainer-app (GSDT) |
|------------------|-------------------|
| `Site` | `Owner` (household) |
| `Client` / `individualHives` | `Dog` |
| `CareAction` | `TrainingLog` |
| `ScheduledTask` | `ScheduledSession` (follow-up) |
| `TaskTemplate` / `tasks` | `TrainingFocus` |
| `Visit` | `TrainingSession` (calendar-linked) |
| `Employee` | `TenantMember` (Firebase Auth + RTDB) |

---

## Routes

| demosuite route | trainer-app | Status |
|-----------------|-------------|--------|
| `/` landing | `/` → dashboard | Skipped (public site is marketing) |
| `/login` | `/login` | Present (Firebase Auth) |
| `/dashboard` | `/dashboard` | Present |
| `/clients`, `/clients/:id` | `/households/*` | Present (+ hub, dogs) |
| `/actions`, `/actions/log` | `/logs`, `/logs/new` | Present |
| `/schedule` | `/schedule` | Present (+ calendar links) |
| `/tasks` | `/focus` | Present |
| `/compliance` | — | Skipped (care regulatory) |
| `/integrity` | `/integrity` | Present (expanded) |
| `/team` | — | Skipped (RTDB bootstrap; no UI) |
| `/reports` | `/reports` | Present |
| — | `/imports/bookings` | Trainer-only |
| — | `/households/:id/dogs/*` | Trainer-only |

---

## Data models

| demosuite collection | trainer-app | Status |
|---------------------|-------------|--------|
| `sites` → owners | `owners` | Present |
| `actions` → logs | `trainingLogs` | Present (+ dogId, location) |
| `scheduledTasks` | `scheduledSessions` | Present |
| `tasks` | `trainingFocus` | Present |
| `employees` | `tenants/{id}/members` | Partial (no UI) |
| `individualHives` | — | Skipped (dogs at top level) |
| `visits` | `trainingSessions` | Partial |
| `taskGroups` | — | Skipped (never had UI) |
| `deletedTasks` | `deletedRecords` | Present (no UI) |
| Medical / careLevel / emergency | — | Skipped |

---

## UI patterns

| Pattern | Status in trainer-app |
|---------|----------------------|
| Stat cards dashboard | Present |
| Card grid catalog + search | Present |
| Alphabet letter headers | Present |
| Archive toggle + badge | Present (households) |
| Type / stage badges | Present |
| Overdue / priority badges | Present |
| Session flag badges | Present (breakthrough/setback/concern) |
| Multi-select task logging | Present |
| Focus library (read-only) | Present |
| Map picker | Present (CSS pin fix) |
| Recharts reports | Present |
| Integrity issue list | Present |
| Sync status overlay | Present |
| Role-gated nav | **Implemented in roadmap** |
| Landing hero | Skipped |
| PWA | Skipped (hosting issues) |
| Team management UI | Skipped |
| Compliance checklist | Skipped |

---

## Trainer-only features (not in demosuite)

- Dogs CRUD with breed/mix selector
- Household hub (dogs, history, follow-ups, calendar)
- Booking import from Google Sheets
- Multi-tenant Firebase Auth + tenant switcher
- Owner/dog lifecycle status and training stages
- Guide/exam-aligned assessment taxonomy, skill grades, owner capacity (roadmap phases P2–P5)

---

## Actionable gaps ported from demosuite

1. Wire `usePermissions()` into navbar and write actions (viewers read-only)
2. Dog archive button (mirror household archive)
3. CSV export from reports (`EXPORT_DATA`)
4. Optional: focus library admin, members UI, deletedRecords UI

---

## Non-goals

Do not re-port: compliance module, medical/emergency fields, care-level, bcrypt employee auth, PWA until hosting strategy is stable.
