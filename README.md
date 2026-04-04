# SkinMinder: Venture-Scale AI Skincare Intelligence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![CI](https://github.com/surulere15/skinminder/actions/workflows/ci.yml/badge.svg)](https://github.com/surulere15/skinminder/actions/workflows/ci.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

SkinMinder is a production-grade, venture-scale AI skincare platform built with Next.js 14, Supabase, and Claude 3.5 Sonnet. It provides high-fidelity skin analysis, personalized morning/evening protocols, and a robust seller ecosystem for skincare brands.

> **Disclaimer**: This is a cosmetic wellness platform. All analyses are for informational purposes only and do not constitute medical diagnosis.

## 🚀 Core Features

### 1. Multi-Engine AI Pipeline
- **Vision Analysis**: Advanced computer vision scores for hydration, texture, pigment, and more from a single photograph.
- **DNA Profiling**: Synthesizes scan history into a long-term "Skin DNA" archetype and vulnerability matrix.
- **Dynamic Routines**: Generates adaptive morning and evening protocols based on skin intelligence and local climate.
- **Concierge Consultant**: 24/7 AI-driven beauty advisor for ingredient safety and routine optimization.

### 2. Premium User Experience
- **Apple-Inspired Design**: Glassmorphic UI, custom animations (Framer Motion), and a curated "Apple meets Skincare" color palette.
- **Multi-Step Onboarding**: High-fidelity data capture for personalized profiling.
- **Intelligence Dashboard**: Data-rich hub featuring radar charts, trend telemetry, and actionable alerts.

### 3. Seller System & Marketplace
- **Brand Insights**: Analytics portal for brands to monitor product views, AI matches, and conversion.
- **Catalog Management**: Simple interface for brands to list products and view "AI Match Index" scores.
- **Personalized Recommendations**: Products are cross-referenced with user skin intelligence for maximum efficacy.

### 4. Viral Growth Mechanics
- **Report Cards**: Server-side generated high-fidelity shareable images for social proof.
- **Community Insights**: Global aggregate trends and local climate-based skin intelligence.
- **Referral Rewards**: Milestone-based growth system with premium tier unlocks.

## 🛠 Tech Stack

### Web App
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, shadcn/ui
- **Backend**: Next.js API Routes, Supabase (PostgreSQL), Edge Runtime
- **AI**: Anthropic Claude 3.5 Sonnet (Vision and Text), Zod-validated schemas
- **Infrastructure**: Supabase Auth/DB, Cloudinary (Image Hosting), @napi-rs/canvas (Image Generation)

### Mobile App (`apps/mobile/`)
- **Framework**: React Native + Expo (iOS & Android)
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS for RN)
- **State**: Zustand + AsyncStorage (offline cache)
- **Shared Backend**: Same Supabase, AI pipeline, and Cloudinary as web

## 📂 Project Structure

```
skinminder/
├── app/                    # Next.js App Router with Route Groups
│   ├── (public)/          # Public-facing pages
│   ├── (auth)/            # Authentication flows
│   ├── (app)/             # Authenticated app pages
│   └── (seller)/          # Seller/brand portal
├── services/ai/           # Core AI orchestration and service modules
├── prompts/               # Separated system prompts for version-controlled AI logic
├── schemas/               # Zod schemas defining all data contracts
├── lib/                   # Shared utilities, constants, and Supabase clients
├── components/            # Atomic UI components and feature-specific layout modules
├── supabase/migrations/   # Database migrations
├── tests/                 # Test suites
└── apps/mobile/           # React Native + Expo mobile app (iOS & Android)
```

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18.18.0
- pnpm >= 9.0.0

### Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/surulere15/skinminder.git
   cd skinminder
   pnpm install
   ```

2. **Environment Variables**: Create a `.env.local` based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Required variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `CLOUDINARY_URL`

3. **Database Setup**: Run the migrations in `supabase/migrations/` in order.

4. **Run Development**:
   ```bash
   pnpm dev
   ```

5. **Run Tests**:
   ```bash
   pnpm test
   ```

### Mobile App

```bash
cd apps/mobile
pnpm install
cp .env.example .env.local
pnpm start
```

## 📸 Screenshots

> _Screenshots coming soon_

<!-- Add screenshots here once available:
![Dashboard](public/landing/dashboard.png)
![Skin Analysis](public/landing/analysis.png)
-->

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

If you discover a security vulnerability, please review our [Security Policy](SECURITY.md).

## ⚖️ Legal & Privacy

Data is encrypted and private by default. All skin analyses are for informational purposes only and do not constitute medical diagnosis.

---

<p align="center">
  &copy; 2026 SkinMinder. Built for the future of wellness.
</p>
