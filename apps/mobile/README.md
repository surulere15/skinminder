# SkinMinder Mobile

Native iOS & Android app for SkinMinder — AI-powered skincare intelligence.

Built with **Expo**, **React Native**, **Supabase**, and **NativeWind** (Tailwind CSS).

## 📱 Features

- **Camera-based skin analysis** — real-time photo capture or library upload
- **AI-powered scoring** — hydration, texture, pigment, pores, sensitivity, firmness
- **Skin DNA profiling** — long-term archetype and vulnerability tracking
- **Personalized routines** — adaptive morning/evening protocols
- **Intelligence dashboard** — trend telemetry and scan history
- **Biometric auth** — Face ID / Touch ID support
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
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.tsx         # Root layout with Stack
│   ├── (auth)/             # Auth screens (sign-in, sign-up)
│   ├── (tabs)/             # Main tab navigation
│   │   ├── index.tsx       # Home screen
│   │   ├── dashboard.tsx   # Intelligence dashboard
│   │   ├── scan.tsx        # Camera scan screen
│   │   ├── routine.tsx     # Morning/evening routine
│   │   └── profile.tsx     # User profile & settings
│   └── seller.tsx          # Brand portal
├── src/
│   ├── components/         # Reusable UI components
│   ├── stores/             # Zustand state management
│   │   ├── auth.ts         # Auth state & actions
│   │   └── scan.ts         # Scan/routine/DNA state
│   ├── lib/                # Utilities & clients
│   │   ├── supabase.ts     # Supabase client (secure storage)
│   │   └── api.ts          # API service functions
│   ├── types/              # TypeScript type definitions
│   └── constants/          # App constants & theme
└── assets/                 # Images, fonts, icons
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
| `expo-image-picker` | Photo library |
| `expo-secure-store` | Secure credential storage |
| `expo-local-authentication` | Biometric auth |
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
