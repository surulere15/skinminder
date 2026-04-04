# SkinMinder Mobile

Native iOS & Android app for SkinMinder — AI-powered skincare intelligence.

Built with **Expo**, **React Native**, **Supabase**, and **NativeWind** (Tailwind CSS).

## 📱 Features

- **5-step onboarding flow** — skin type, concerns, age range, climate profiling
- **Camera-based skin analysis** — real-time photo capture or library upload
- **AI-powered scoring** — hydration, texture, pigment, pores, sensitivity, firmness
- **Skin DNA profiling** — long-term archetype and vulnerability tracking
- **Personalized routines** — adaptive morning/evening protocols
- **Intelligence dashboard** — trend telemetry and scan history
- **Biometric auth** — Face ID / Touch ID support
- **Push notifications** — routine reminders and alerts
- **Offline support** — cached data with 30-min TTL, graceful fallback
- **Connectivity awareness** — auto-detects online/offline state
- **Brand portal** — seller analytics and product insights

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- Xcode (iOS) or Android Studio (Android)
- Expo Go app on your device (for development)

### Setup

```bash
# From the repo root
cd apps/mobile

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
pnpm start
```

### Run on Device

```bash
# iOS
pnpm ios

# Android
pnpm android

# Web (for preview)
pnpm web
```

## 🏗 Architecture

```
apps/mobile/
├── app/                        # Expo Router (file-based routing)
│   ├── _layout.tsx             # Root layout with Stack + init
│   ├── (auth)/                 # Auth screens (sign-in, sign-up)
│   ├── (onboarding)/           # 5-step onboarding flow
│   │   ├── welcome.tsx         # Welcome & feature overview
│   │   ├── skin-type.tsx       # Skin type selection
│   │   ├── concerns.tsx        # Multi-select skin concerns
│   │   ├── age-range.tsx       # Age range picker
│   │   └── climate.tsx         # Climate zone + profile save
│   ├── (tabs)/                 # Main tab navigation
│   │   ├── _layout.tsx         # Tab bar config
│   │   ├── index.tsx           # Home screen (offline-aware)
│   │   ├── dashboard.tsx       # Intelligence dashboard
│   │   ├── scan.tsx            # Camera scan + results
│   │   ├── routine.tsx         # Morning/evening routine
│   │   └── profile.tsx         # User profile & settings
│   └── seller.tsx              # Brand portal
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Button, Card, ScoreDisplay
│   │   └── layout/             # Screen, Section, SectionHeader
│   ├── stores/                 # Zustand state management
│   │   ├── auth.ts             # Auth state & actions
│   │   ├── scan.ts             # Scan/routine/DNA + offline
│   │   └── onboarding.ts       # Onboarding state + AsyncStorage
│   ├── services/               # Platform services
│   │   └── notifications.ts    # Push notifications (Expo)
│   ├── lib/                    # Utilities & clients
│   │   ├── supabase.ts         # Supabase client (SecureStore)
│   │   ├── api.ts              # API service functions
│   │   ├── offline.ts          # Offline cache (AsyncStorage)
│   │   └── utils.ts            # Helpers (formatScore, etc.)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useConnectivity.ts  # Network state (NetInfo)
│   │   └── useAppState.ts      # App foreground/background
│   ├── types/                  # TypeScript type definitions
│   └── constants/              # App constants & theme
└── assets/                     # Images, fonts, icons
```

## 🔌 Shared Backend

The mobile app reuses the **exact same backend** as the web app:

| Service | Shared? | Details |
|---------|---------|---------|
| Supabase Auth | ✅ | Same users, sessions, RLS policies |
| Supabase DB | ✅ | Same tables, migrations, queries |
| AI Pipeline | ✅ | Same Claude vision analysis endpoint |
| Cloudinary | ✅ | Same image upload/storage |
| Routines | ✅ | Same routine generation engine |
| Skin DNA | ✅ | Same archetype synthesis |
| Push Notifications | ✅ | Same push_subscriptions table |

## 📡 Offline Architecture

```
Online:  API → State → Cache (AsyncStorage, 30-min TTL)
Offline: Cache → State → "Offline" banner UI
Reconnect: Auto-refresh + cache update
```

- **Scans, routines, DNA** cached with 30-minute TTL
- **Auto-fallback** to cache when network unavailable
- **Connectivity hook** shows offline banner on home screen
- **Stale-while-revalidate** pattern for seamless UX

## 🔔 Push Notifications

- **Routine reminders** — scheduled morning/evening alerts
- **Token registration** — auto-saved to `push_subscriptions` table
- **Deep linking** — notifications route to relevant screens
- **Permission flow** — graceful request on first auth

## 🎨 Design System

- **Colors**: Dark theme with warm gold (#a18b6f) primary accent
- **Typography**: SF Pro (iOS) / Roboto (Android) via system fonts
- **Components**: NativeWind utility classes (Tailwind for React Native)
- **Animations**: React Native Reanimated

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | Core framework |
| `expo-router` | File-based navigation |
| `expo-camera` | Camera access |
| `expo-notifications` | Push notifications |
| `expo-secure-store` | Secure credential storage |
| `expo-local-authentication` | Biometric auth |
| `expo-device` | Device info for push tokens |
| `@react-native-async-storage/async-storage` | Offline cache |
| `@react-native-community/netinfo` | Connectivity detection |
| `@supabase/supabase-js` | Backend client |
| `nativewind` | Tailwind CSS for RN |
| `zustand` | State management |
| `react-native-reanimated` | Animations |

## 🔐 Security

- Credentials stored in SecureStore (Keychain/Keystore)
- All API calls authenticated via Supabase sessions
- RLS policies enforced on all database queries
- Biometric authentication for sensitive actions

## 🚢 Deployment

### Build with EAS

```bash
# Install EAS CLI
pnpm add -g eas-cli

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `EXPO_PUBLIC_API_URL` | Optional | API base URL (defaults to api.skinminder.ai) |

## 🤝 Contributing

See the root [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT — see [LICENSE](../../LICENSE).
