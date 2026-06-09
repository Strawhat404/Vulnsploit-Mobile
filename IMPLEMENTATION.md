# VulnSploit Mobile — Implementation Plan

> **Stack:** Expo SDK 54 · React Native · TypeScript · Expo Router · TanStack Query · Zustand · Axios  
> **Backend:** `../Vulnsploit` Django API (default `http://localhost:8001`)  
> **Design reference:** `../MOBILE_APP_BRIEF.md` and `VulnSploit-FrontEnd/`

---

## Prerequisites (one-time on your machine)

```bash
# Node 20+ recommended
node -v && npm -v

cd Vulnsploit-Mobile
cp .env.example .env
npm install

# Start backend (sibling repo)
cd ../Vulnsploit && docker compose up -d

# Run mobile
cd ../Vulnsploit-Mobile
npx expo start
```

Use **Expo Go** on your phone (same Wi‑Fi) or an emulator. For physical device, set `EXPO_PUBLIC_API_URL` to your machine's LAN IP (e.g. `http://192.168.1.10:8001`).

---

## Repository structure

```
Vulnsploit-Mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/             # login, register
│   ├── (tabs)/             # main tab navigator
│   ├── scans/[id].tsx      # scan detail
│   ├── recon/[id].tsx      # recon detail
│   └── reports/[id].tsx    # report detail
├── src/
│   ├── api/                # client, endpoints, interceptors
│   ├── components/         # UI building blocks
│   ├── constants/          # scan types, legal copy
│   ├── config/             # env
│   ├── hooks/              # React Query hooks
│   ├── services/           # offline sync, secure storage (Phase 6)
│   ├── store/              # Zustand
│   ├── theme/              # colors, spacing
│   └── types/              # API TypeScript types
├── assets/                 # icons, splash
├── docs/                   # product brief copy
└── IMPLEMENTATION.md       # this file
```

---

## Build phases

### Phase 0 — Scaffold ✅

- [x] Expo + TypeScript + Expo Router
- [x] `.gitignore`, `.env.example`, `eas.json`
- [x] Theme tokens, API types, scan type constants
- [x] Tab + auth route shells
- [x] Placeholder screens

**Exit criteria:** `npm install && npx expo start` opens app with 5 tabs + login redirect.

---

### Phase 1 — Auth & API foundation ✅

**Goal:** Real login/register with secure token persistence.

| Task | Files |
|------|-------|
| Secure token storage | `src/services/secureStorage.ts` (expo-secure-store) |
| Hydrate auth on launch | `app/_layout.tsx` or `app/index.tsx` |
| JWT interceptors + refresh | `src/api/interceptors.ts` |
| Auth API | `src/api/auth.ts` |
| Login UI | `app/(auth)/login.tsx` |
| Register UI | `app/(auth)/register.tsx` |
| Auth hook | `src/hooks/useAuth.ts` |
| Logout in tab header | `src/components/Header.tsx` |

**API:**
- `POST /api/token/`
- `POST /api/token/refresh/`
- `POST /api/register/`

**Exit criteria:** Register → login → land on Dashboard; tokens survive app restart; 401 triggers refresh once.

---

### Phase 2 — Dashboard ✅

**Goal:** Command center with live stats.

| Task | Files |
|------|-------|
| Scans list hook | `src/hooks/useScans.ts` |
| Dashboard UI | `app/(tabs)/index.tsx` |
| Stat cards | `src/components/StatCard.tsx` |
| Recent scans list | `src/components/ScanListItem.tsx` |
| Quick-launch to scan tab | navigation with `?type=` param |

**API:** `GET /api/scans/?page=1` (poll 8s optional)

**Exit criteria:** Shows scan count by status, 6 recent scans, tap opens detail.

---

### Phase 3 — Scans (create, history, detail)

**Goal:** Full single-scan workflow.

| Task | Files |
|------|-------|
| Create scan mutation | `src/hooks/useScans.ts` |
| Scan type picker UI | `app/(tabs)/scan.tsx` |
| Target validation hints | mirror backend validators |
| History + filters | `app/(tabs)/history.tsx` |
| Scan detail + poll 3s | `app/scans/[id].tsx` |
| Terminal output | `src/components/TerminalOutput.tsx` |
| Status badge | `src/components/StatusBadge.tsx` |
| JSON result panel | collapsible in scan detail |

**API:**
- `POST /api/scans/` `{ target, scan_type }`
- `GET /api/scans/:id/`

**Exit criteria:** Launch nmap quick scan → see live terminal output → completed state.

---

### Phase 4 — Full recon

**Goal:** 7-tool pipeline with progress.

| Task | Files |
|------|-------|
| Recon hooks | `src/hooks/useRecon.ts` |
| Recon form | `app/(tabs)/recon.tsx` |
| Recon detail + poll | `app/recon/[id].tsx` |
| Pipeline stepper | `src/components/ReconPipeline.tsx` |
| Link to report when `report_id` set | navigation |

**API:**
- `POST /api/recon/` `{ target }`
- `GET /api/recon/:id/` (poll 5–15s)

**Exit criteria:** Full recon runs, progress bar updates, per-tool statuses visible.

---

### Phase 5 — Reports

**Goal:** Findings UI + PDF download.

| Task | Files |
|------|-------|
| Reports hooks | `src/hooks/useReports.ts` |
| Reports list | `app/(tabs)/reports.tsx` |
| Report detail | `app/reports/[id].tsx` |
| Finding card | `src/components/FindingCard.tsx` |
| Severity summary | `src/components/SeverityBar.tsx` |
| PDF download | `expo-file-system` + Bearer header |

**API:**
- `GET /api/reports/`
- `GET /api/reports/:id/`
- `GET /api/reports/:id/download/`

**Exit criteria:** View findings offline after fetch; open/share PDF.

---

### Phase 6 — Offline-first

**Goal:** Cache-first UX + sync queue.

| Task | Files |
|------|-------|
| NetInfo banner | `src/components/OfflineBanner.tsx` |
| Persist React Query cache | `@tanstack/query-async-storage-persister` |
| Mutation queue (offline scans) | `src/services/syncQueue.ts` |
| Optional WatermelonDB | `src/db/` schema + sync adapter |

**Exit criteria:** Airplane mode shows cached history; queued scan runs when online.

---

### Phase 7 — Polish & ship

| Task | Notes |
|------|-------|
| JetBrains Mono via expo-font | Brand typography |
| Splash + app icons | `assets/` |
| Error boundaries | network, 403 rate limit |
| Settings screen | API URL override (dev) |
| EAS Build | `eas build --platform all` |
| Store listing copy | legal disclaimer |

---

## Shared components to build

| Component | Used in |
|-----------|---------|
| `TerminalOutput` | Scan detail |
| `StatusBadge` | Lists, detail |
| `CyberCard` | Dashboard, forms |
| `OfflineBanner` | Global |
| `PageHeader` | All screens (`root@vulnsploit:~$`) |
| `EmptyState` | Lists |
| `ErrorAlert` | Forms |

---

## API quick reference

| Action | Method | Path |
|--------|--------|------|
| Health | GET | `/api/health/` |
| Login | POST | `/api/token/` |
| Refresh | POST | `/api/token/refresh/` |
| Register | POST | `/api/register/` |
| List scans | GET | `/api/scans/` |
| Create scan | POST | `/api/scans/` |
| Scan detail | GET | `/api/scans/:id/` |
| Start recon | POST | `/api/recon/` |
| Recon detail | GET | `/api/recon/:id/` |
| List reports | GET | `/api/reports/` |
| Report detail | GET | `/api/reports/:id/` |
| Download PDF | GET | `/api/reports/:id/download/` |

---

## Rate limits (show user-friendly errors)

| Endpoint | Limit |
|----------|-------|
| Login | 10 / 15 min per IP |
| Register | 5 / hour per IP |
| POST scans | 20 / hour per user |
| POST recon | 5 / hour per user |

---

## Future versions (not in v1)

- **LAN agent:** configurable base URL → local Docker on laptop
- **Push notifications** when scan completes
- **WatermelonDB** full sync if dataset grows large
- **On-device light checks** (optional, separate epic)

---

## Current status

**Phase 2 complete.** Next step: **Phase 3 (Scans)** — create scan, history, detail + terminal output.
