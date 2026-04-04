interface AnalyticsInterface {
  track?(eventName: string, properties?: Record<string, any>): void;
  pageView?(url: string): void;
}

declare global {
  interface Window {
    posthog?: AnalyticsInterface;
    gtag?: AnalyticsInterface;
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  const analytics = getAnalytics();
  if (analytics) {
    analytics.track?.(eventName, properties);
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }
}

export function trackPageView(url: string) {
  const analytics = getAnalytics();
  if (analytics) {
    analytics.pageView?.(url);
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Page view:', url);
  }
}

function getAnalytics(): AnalyticsInterface | null {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
  
  if (!provider || provider === 'none') {
    return null;
  }

  switch (provider) {
    case 'postHog':
      return typeof window !== 'undefined' && window.posthog ? window.posthog : null;
    case 'google':
      return typeof window !== 'undefined' && window.gtag ? window.gtag : null;
    default:
      return null;
  }
}
