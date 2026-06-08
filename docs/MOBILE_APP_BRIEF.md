# VulnSploit Mobile App — Project Brief

> **Purpose:** Single source of truth for designing and building the VulnSploit mobile app.
> **Status:** Implementation in progress — see `../IMPLEMENTATION.md`.
> **Last audited:** 2026-05-22

---

## 1. Product Vision & Intent

**VulnSploit** is a containerized penetration-testing platform that wraps industry-standard security tools behind a unified REST API. Users run authorized vulnerability scans and reconnaissance against targets they own or have permission to test.

### Core goals
- **Democratize pentesting workflows** — one UI/API to launch Nmap, Nikto, SQLMap, Nuclei, Gobuster, Subfinder, WhatWeb, WPScan, etc.
- **Non-blocking async execution** — long scans run in Celery workers; clients poll for results.
- **Actionable output** — raw tool logs + structured JSON + AI-interpreted findings + PDF reports.
- **Security-first API** — JWT auth, input validation (anti command-injection), rate limits.

### Target users
- Security researchers, pentesters, bug bounty hunters, students learning offensive security.
- **Legal framing (required in UI):** "FOR AUTHORIZED PENETRATION TESTING ONLY"

### Repos
| Part | Path | Remote |
|------|------|--------|
| Backend | `Vulnsploit/` | https://github.com/Strawhat404/Vulnsploit.git |
| Web UI | `VulnSploit-FrontEnd/` | https://github.com/Strawhat404/VulnSploit-FrontEnd.git |

---

## 2. Architecture

```
Mobile App
    │  HTTPS + JWT Bearer
    ▼
Django REST API (:8000 container, :8001 host in docker-compose)
    │  Celery .delay()
    ▼
Celery Worker ──► subprocess: nmap, nikto, sqlmap, nuclei, ...
    │
Redis (broker + result backend)
    │
SQLite (dev) / PostgreSQL (prod-ready)
```

**No WebSockets.** All job progress is poll-driven via REST.

---

## 3. Design System (Web → Mobile)

### Brand
- Wordmark: **VULN** (white) + **SPLOIT** (blue `#3b82f6`)
- Logo: Shield icon (Lucide)
- Tagline: "PENETRATION TESTING ENGINE" / "ADVANCED VULNERABILITY SCANNER"

### Theme: Cyber / Terminal aesthetic
- Near-black backgrounds, electric blue accents, mono typography
- Terminal chrome: red/yellow/blue window dots + title bar
- Shell prompts: `root@vulnsploit:~$ <page>`
- Corner bracket accents on cards
- Optional: grid background, scanline overlay (subtle on mobile)

### Color tokens
```json
{
  "primary": "#3b82f6",
  "secondary": "#06b6d4",
  "danger": "#ff0040",
  "warning": "#f59e0b",
  "bg": "#000000",
  "surface": "#0d0d0f",
  "surfaceDeep": "#050507",
  "border": "#1a1d26",
  "mutedBar": "#252830",
  "text": "#e0e0e0",
  "textMuted": "#6b7280",
  "fontFamily": "JetBrains Mono"
}
```

### Status colors
| Status | Color |
|--------|-------|
| pending | `#f59e0b` |
| running | `#06b6d4` |
| completed | `#60a5fa` |
| failed | `#ff0040` |

### Severity (reports)
| Level | Color |
|-------|-------|
| CRITICAL | `#ff0040` |
| HIGH | orange |
| MEDIUM | amber |
| LOW | blue |
| INFO | gray |

### Typography
- JetBrains Mono (300–800) for everything — labels often ALL-CAPS + `tracking-widest`

---

## 4. User Flows (Mobile Parity)

### Auth
1. Register → `POST /api/register/` → redirect to login (no auto-token)
2. Login → `POST /api/token/` → store `access` + `refresh` securely
3. API calls → `Authorization: Bearer <access>`
4. 401 → refresh via `POST /api/token/refresh/` → retry once → logout

### Main navigation (5 tabs suggested)
| Tab | Web route | Purpose |
|-----|-----------|---------|
| Dashboard | `/dashboard` | Stats, recent scans, quick-launch |
| New Scan | `/scan` | Target + scan type picker |
| Full Recon | `/recon/new` | One-click 7-tool pipeline |
| History | `/history` | Paginated scan list + filters |
| Reports | `/reports` | Findings + PDF download |

### Scan flow
1. Enter target (domain, IP, CIDR, URL)
2. Pick scan type from categories: NMAP, WEB, EXPLOIT, RECON
3. `POST /api/scans/` → navigate to detail
4. Poll `GET /api/scans/:id/` every **3s** until `completed` or `failed`
5. Show raw `result` in terminal view + optional `result_json` panel

### Full recon flow (use `/api/recon/` — canonical)
1. Enter target → `POST /api/recon/`
2. Poll `GET /api/recon/:id/` every **5–15s**
3. Show progress: `completed_scans / total_scans` + per-tool rows in `scans[]`
4. Tools run sequentially: subfinder → whatweb → quick (nmap) → nikto → gobuster → nuclei → sqlmap
5. ETA: 15–40 min (show disclaimer)
6. On complete → auto-report may generate → link to `/reports/:report_id`

### Report flow
1. List: `GET /api/reports/` — risk level, severity counts, status
2. Detail: `GET /api/reports/:id/` — poll while `generating`
3. Findings: expandable cards (title, severity, description, impact, recommendation, evidence)
4. PDF: `GET /api/reports/:id/download/` with Bearer token (not public media URL)

---

## 5. API Reference (Complete)

Base: `{API_URL}/api/` — default `http://localhost:8000` (Docker host maps **8001**)

### Public
| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `health/` | — | `{status, service}` |
| POST | `token/` | `{username, password}` | `{access, refresh}` |
| POST | `token/refresh/` | `{refresh}` | `{access}` |
| POST | `register/` | `{username, password, password2}` | `{detail}` |

### Authenticated
| Method | Path | Notes |
|--------|------|-------|
| GET | `scans/?page=&page_size=` | Standalone scans only (excludes recon children) |
| POST | `scans/` | `{target, scan_type}` |
| GET | `scans/:id/` | Full result + status |
| POST | `recon/` | `{target}` — starts full recon |
| GET | `recon/list/` | Paginated sessions |
| GET | `recon/:id/` | Session + nested `scans[]` |
| GET | `reports/` | List reports |
| GET | `reports/:id/` | Findings + severity |
| POST | `reports/generate/` | `{scan_ids: [1,2,3]}` — manual report |
| GET | `reports/:id/download/` | PDF stream |

### Valid scan types
```
# Nmap modes
quick, full, os_detection, aggressive, udp, ping_sweep, service_version, stealth, vuln
# Web
nikto, gobuster, whatweb, wpscan
# Exploit
sqlmap
# Recon
subfinder, nuclei
```
Full recon = `POST /api/recon/` (NOT `scan_type: full_recon` on scans endpoint for orchestration).

### Rate limits (show UX warnings on 403)
| Endpoint | Limit |
|----------|-------|
| Login | 10 / 15 min per IP |
| Register | 5 / hour per IP |
| POST scans | 20 / hour per user |
| POST recon | 5 / hour per user |
| Global authenticated | 100 / hour per user |

### Polling intervals (recommended)
| Resource | Interval | Stop when |
|----------|----------|-----------|
| Scan detail | 3s | completed / failed |
| Scan list | 8s | — |
| Recon detail | 5–15s | completed |
| Report detail | 3–10s | ready / failed |

Use exponential backoff after 2–5 min. Celery hard limit: 1 hour.

---

## 6. Data Models

### ScanResult
- `target`, `scan_type`, `status` (pending|running|completed|failed)
- `result` (raw text), `result_json` (structured)
- `recon_session` FK (null for standalone scans)
- Timestamps: `created_at`, `completed_at`

### ReconSession
- `target`, `status`, progress via child scans
- One-to-one optional `ScanReport`

### ScanReport
- `status` (generating|ready|failed)
- `findings_json[]`, `severity_counts`, `risk_level`
- `pdf_file`, `error_message`
- Note: `executive_summary` exists in AI output but **not exposed in API serializer**

### Finding shape (for mobile cards)
```json
{
  "title": "string",
  "severity": "critical|high|medium|low|info",
  "description": "string",
  "impact": "string",
  "recommendation": "string",
  "evidence": "string",
  "tool": "nmap|nikto|..."
}
```

---

## 7. Mobile-Specific Requirements

### Must implement
- Secure token storage (Keychain / Keystore — NOT localStorage)
- JWT refresh before access expiry (~5 min default)
- Poll-driven job UI with progress indicators
- Terminal-style log viewer (scrollable, copy, monospace)
- Authorized-use disclaimer on scan/recon screens
- PDF download with auth header + share/save
- Offline-friendly error states (network, rate limit, 5xx)
- Partial success UI for recon (some tools may fail while session completes)

### Nice to have (v2)
- Push notifications when scan completes (needs backend work)
- Biometric app lock
- Deep links to scan/report detail
- Cancel scan endpoint (not in API today)

### Known web debt to avoid in mobile
1. **Dual recon APIs** — web has orphaned `/api/sessions/` path in `NewScan.jsx`; mobile should use **`POST /api/recon/` only**
2. **`/sessions/:id` route missing** on web — don't replicate
3. **Port mismatch** — Login defaults 8001, axios 8000; pick one config for mobile
4. **`executive_summary` not in API** — derive client-side or request backend addition

---

## 8. Screen Inventory (Suggested)

| Screen | Key data |
|--------|----------|
| Splash / Onboarding | Brand, legal disclaimer |
| Login | username, password |
| Register | username, password, confirm |
| Dashboard | stats, chart, recent 6 scans |
| New Scan | target input, categorized type grid |
| Scan Detail | status, terminal output, JSON toggle |
| History | search, filters, pagination |
| Full Recon | target, 7-tool pipeline preview |
| Recon Detail | progress bar, per-tool status |
| Reports List | risk badges, severity summary |
| Report Detail | findings accordion, PDF button |
| Settings | API URL (dev), logout, about |
| 404 | terminal glitch aesthetic |

---

## 9. Tech Stack Recommendations (When Building)

| Layer | Suggestion |
|-------|------------|
| Framework | React Native (Expo) or Flutter — matches web React mental model |
| HTTP | Axios + interceptors (mirror web `axios.js`) |
| State | Zustand or React Query (mirror web patterns) |
| Storage | expo-secure-store / react-native-keychain |
| Charts | react-native-chart-kit or Victory |
| Icons | lucide-react-native |
| Navigation | React Navigation (bottom tabs + stack) |

---

## 10. Key Source Files

### Backend
- `Vulnsploit/backend/scanner/models.py` — data model
- `Vulnsploit/backend/scanner/views.py` — API logic
- `Vulnsploit/backend/scanner/serializers.py` — response shapes
- `Vulnsploit/backend/scanner/urls.py` — routes
- `Vulnsploit/backend/scanner/validators.py` — scan types + target validation
- `Vulnsploit/backend/scanner/tasks.py` — Celery orchestration
- `Vulnsploit/backend/scanner/ai_interpreter.py` — findings AI
- `Vulnsploit/backend/Vulnsploit/settings.py` — CORS, JWT, rate limits

### Frontend (design reference)
- `VulnSploit-FrontEnd/tailwind.config.js` — design tokens
- `VulnSploit-FrontEnd/src/index.css` — global cyber styles
- `VulnSploit-FrontEnd/src/pages/*.jsx` — all screens
- `VulnSploit-FrontEnd/src/components/*.jsx` — reusable UI
- `VulnSploit-FrontEnd/src/hooks/*.js` — API + polling patterns
- `VulnSploit-FrontEnd/src/store/authStore.js` — auth state
- `VulnSploit-FrontEnd/src/lib/axios.js` — API client

---

## 11. Marketing Copy (Landing — reuse in app store / onboarding)

- "Full Arsenal. One API." — Nmap, SQLMap, Subfinder, Gobuster, Nuclei, WhatWeb, Nikto
- "Built for Performance" — Django REST → Redis → Celery → Tools
- Stats: 9+ scan modules, JWT auth, async queue, 100% dockerized
- MIT License, v1.0.0
