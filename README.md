# VulnSploit Mobile

Official mobile client for [VulnSploit](https://github.com/Strawhat404/Vulnsploit) — authorized penetration testing on the go.

**Stack:** Expo · React Native · TypeScript · Expo Router · TanStack Query · Zustand

---

## Requirements

| Tool | Version |
|------|---------|
| **Node.js** | **20.19.4+** (LTS) — Node 18 will fail with current Expo |
| npm | 10+ |

Check: `node -v` — must **not** be v18.

### Install Node 20 (if you only have Node 18)

**Option A — nvm (recommended, no apt lock fights):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# restart terminal, then:
nvm install 20
nvm use 20
node -v   # should show v20.x
```

**Option B — NodeSource (system-wide):**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

---

## Quick start

```bash
# 1. Install dependencies (Node 20+ required)
npm install

# 2. Configure API URL
cp .env.example .env
# Edit EXPO_PUBLIC_API_URL — use LAN IP for physical device testing

# 3. Start backend (sibling repo)
cd ../Vulnsploit && docker compose up -d

# 4. Run the app
npm start
# or: npx expo start   (only after npm install — uses local expo from package.json)
```

> **Do not** run `npx expo start` before `npm install` — npx may download Expo 56 which requires Node 20 and will crash on Node 18.

Scan the QR code with **Expo Go** (Android/iOS) or press `a` / `i` for emulator.

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:8001` | Django API base (no trailing slash) |
| `EXPO_PUBLIC_API_TIMEOUT_MS` | `30000` | Request timeout |
| `EXPO_PUBLIC_DEBUG_API` | `false` | Log API requests in console |

> `.env` is gitignored. Never commit secrets.

---

## Project docs

| File | Purpose |
|------|---------|
| [IMPLEMENTATION.md](./IMPLEMENTATION.md) | Phased build plan (Phase 0–7) |
| [docs/MOBILE_APP_BRIEF.md](./docs/MOBILE_APP_BRIEF.md) | Product spec, API, design tokens |

---

## Related repos

| Repo | Role |
|------|------|
| [Vulnsploit](../Vulnsploit) | Django + Celery backend |
| [VulnSploit-FrontEnd](../VulnSploit-FrontEnd) | React web UI (design reference) |

---

## Legal

**FOR AUTHORIZED PENETRATION TESTING ONLY.** Only scan targets you own or have written permission to test.

---

## License

MIT — see backend repo for details.
