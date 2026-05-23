# SnapHire — Real-time Hiring Marketplace

> Uber for labour. India-first. Mobile-only.

## Quick Start

### 1. Start the Backend

```bash
docker compose up --build
```

Backend runs at: http://localhost:8001  
API docs: http://localhost:8001/docs

### 2. Start the Mobile App

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go (Android/iOS) or press `a` for Android emulator.

> For Android emulator: change `API_BASE_URL` in `mobile/constants/index.ts` to `http://10.0.2.2:8001`

---

## Demo Flow

### As a Worker
1. Open app → Onboarding → Select **Worker**
2. Enter any 10-digit phone number → OTP: **123456**
3. Set up profile (name, skill, wage, city)
4. Browse nearby jobs, view details, apply
5. Accept hire requests from employers
6. Update job status: On the Way → Started → Completed
7. Track earnings in Wallet

### As an Employer
1. Open app → Onboarding → Select **Employer**
2. Enter any 10-digit phone number → OTP: **123456**
3. Set up profile (name, company, city)
4. Post a job (skill, wage, duration, city)
5. Browse nearby workers, view profiles
6. Send hire requests
7. Track hire status, confirm payment

---

## Architecture

```
snaphire/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic/          # DB migrations
│   └── app/
│       ├── main.py
│       ├── api/          # FastAPI routes
│       ├── models/       # SQLAlchemy models
│       ├── schemas/      # Pydantic schemas
│       ├── services/     # Business logic
│       ├── core/         # Config, security
│       ├── db/           # Database session
│       └── websocket/    # Real-time manager
└── mobile/
    ├── app/
    │   ├── index.tsx         # Splash
    │   ├── onboarding.tsx    # Carousel
    │   ├── auth/             # Login flow
    │   ├── (worker)/         # Worker tabs
    │   └── (employer)/       # Employer tabs
    ├── components/           # Reusable UI
    ├── store/                # Zustand state
    ├── services/             # Axios API
    ├── types/                # TypeScript types
    ├── theme/                # Colors
    └── constants/            # App constants
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Mobile | React Native + Expo + TypeScript |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| HTTP | Axios |
| Lists | FlashList |
| Backend | FastAPI + Python |
| Database | PostgreSQL |
| ORM | SQLAlchemy (async) |
| Migrations | Alembic |
| Auth | JWT |
| Real-time | WebSockets |
| Cache | Redis |

## OTP (Demo Mode)

OTP is always **123456** in demo mode. In production, integrate MSG91 or Twilio in `backend/app/services/otp.py`.

## Database

Starts completely empty. All data is created through user actions only.
