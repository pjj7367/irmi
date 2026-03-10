# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"이르미(IRMI)" - 민생위기 조기경보 레이더. A news-based socioeconomic risk early-detection and response support service. The UI is in Korean. Currently uses mock data (`lib/mock-data.ts`); no backend API integration yet.

## Commands

- `npm run dev` - Start dev server (Next.js, default port 3000)
- `npm run build` - Production build
- `npm run lint` - ESLint (flat config, Next.js core-web-vitals + typescript rules)
- `npm start` - Serve production build

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19, TypeScript 5
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss` plugin
- **Charts:** Recharts 3 (RadarChart, LineChart)
- **Icons:** lucide-react
- **State:** zustand (installed but not yet used)
- **Path alias:** `@/*` maps to project root

## Architecture

### Routing (App Router)
- `/` - Dashboard: overall risk gauge, radar chart, trend line chart, signal preview
- `/signals` - Crisis signals list with category/level filtering
- `/analysis` - News analysis with keyword cloud, category filter, search
- `/regions` - Regional risk cards with level filtering

### Layout
`app/layout.tsx` renders `Header` + `TabNav` (sticky top nav + tab navigation) wrapping page content in `<main>`. All pages share this shell.

### Component Organization
```
components/
  common/       - Header, TabNav (shared layout)
  dashboard/    - RiskGauge, CategoryChart, TrendChart, SignalPreview, StatCards
  signals/      - SignalFilter, SignalCard
  analysis/     - NewsCard, KeywordCloud
  regions/      - RegionMap
```

### Data Layer
- `lib/types.ts` - Core types: `RiskLevel`, `Category`, `RiskScore`, `Signal`, `NewsArticle`, `RegionRisk`
- `lib/mock-data.ts` - All mock data exports (mockRiskScore, mockSignals, mockNewsArticles, mockRegions, mockTrendData)
- `lib/utils.ts` - Risk-level utility functions (color, background, badge, label mappings) and `formatDate`

### Key Domain Concepts
- **RiskLevel:** `"critical" | "warning" | "watch" | "safe"` - four-tier severity
- **Category:** `"물가" | "고용" | "자영업" | "금융" | "부동산"` - five socioeconomic risk categories
- Risk scores 0-100: >=75 critical, >=60 warning, >=45 watch, <45 safe (see `getScoreLevel` in `lib/utils.ts`)

## Coding Conventions

- All components are client components (`"use client"`) except the root layout and dashboard page
- No emojis in code or output
- Environment variables must go in `.env` file, never hardcoded in source
- Styles must use `app/globals.css` as the central style foundation; avoid hardcoding style values inline when they can be defined as CSS variables or Tailwind theme extensions there
- Use the installed MCP tools (context7, playwright, shadcn, sequential-thinking) actively during development
- Korean language for all UI text and labels
