import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import "@/lib/validate-env";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { PushProvider } from "@/lib/push-context";
import { ServiceWorkerRegistration } from "@/components/ui/service-worker-registration";
import { SubscriptionProvider } from "@/lib/subscription";
import { I18nProvider } from "@/lib/i18n/use-i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://skinminder.ai';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: "SkinMinder | AI Skin Intelligence Platform",
    template: "%s | SkinMinder",
  },
  description: "Personalized skincare analysis, ingredient intelligence, and beauty consulting powered by advanced AI. Get your Skin DNA and custom routines.",
  keywords: ["skincare", "AI", "skin analysis", "beauty", "skincare routine", "ingredient scanner", "skin DNA"],
  authors: [{ name: "SkinMinder" }],
  creator: "SkinMinder",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: url,
    siteName: "SkinMinder",
    title: "SkinMinder | AI Skin Intelligence Platform",
    description: "Personalized skincare analysis, ingredient intelligence, and beauty consulting powered by advanced AI.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SkinMinder - AI Skin Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkinMinder | AI Skin Intelligence Platform",
    description: "Personalized skincare analysis, ingredient intelligence, and beauty consulting powered by advanced AI.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          outfit.variable
        )}
      >
        {process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === "postHog" && process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(t,e){if(!t.e){t.e=function(){(t.e=[].push(arguments))[0]!==arguments[0]?t.e.apply(t.e,arguments):void 0},t.e.q=[],t.e.v=2}}(window,document);
                window.posthog = window.posthog || {};
                window.posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', { api_host: 'https://app.posthog.com', autocapture: true });
              `,
            }}
          />
        )}
        <main className="relative flex min-h-screen flex-col">
          <I18nProvider>
            <PushProvider>
              <ServiceWorkerRegistration />
              <SubscriptionProvider>
                {children}
              </SubscriptionProvider>
            </PushProvider>
          </I18nProvider>
        </main>
        <CookieConsent />
      </body>
    </html>
  );
}
