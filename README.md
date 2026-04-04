# SkinMinder: Venture-Scale AI Skincare Intelligence

SkinMinder is a production-grade, venture-scale AI skincare platform built with Next.js 14, Supabase, and Claude 3.5 Sonnet. It provides high-fidelity skin analysis, personalized morning/evening protocols, and a robust seller ecosystem for skincare brands.

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

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, shadcn/ui.
- **Backend**: Next.js API Routes, Supabase (PostgreSQL), Edge Runtime.
- **AI**: Anthropic Claude 3.5 Sonnet (Vision and Text), Zod-validated schemas.
- **Infrastructure**: Supabase Auth/DB, Cloudinary (Image Hosting), @napi-rs/canvas (Image Generation).

## 📂 Project Structure

- `app/`: Next.js App Router with Route Groups (`(public)`, `(auth)`, `(app)`, `(seller)`).
- `services/ai/`: Core AI orchestration and service modules.
- `prompts/`: Separated system prompts for version-controlled AI logic.
- `schemas/`: Zod schemas defining all data contracts (AI outputs, DB inputs).
- `lib/`: Shared utilities, constants, and Supabase clients.
- `components/`: Atomic UI components and feature-specific layout modules.

## 🚦 Getting Started

1. **Clone & Install**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Create a `.env.local` based on `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `CLOUDINARY_URL`

3. **Database Setup**:
   Run the migrations in `supabase/migrations/` in order.

4. **Run Development**:
   ```bash
   pnpm dev
   ```

## ⚖️ Legal & Privacy
This is a cosmetic wellness platform. All analyses are for information only and do not constitute medical diagnosis. Data is encrypted and private by default.

---
© 2026 SkinMinder. Built for the future of wellness.
