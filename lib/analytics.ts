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

// Core event types for SkinMinder
export type SkinMinderEvent =
  // Onboarding
  | 'onboarding_started'
  | 'onboarding_step_completed'
  | 'onboarding_completed'
  | 'onboarding_abandoned'
  // Scans
  | 'scan_initiated'
  | 'scan_quality_rejected'
  | 'scan_analyzed'
  | 'scan_completed'
  | 'scan_failed'
  // First Value
  | 'first_scan_completed'
  | 'results_viewed'
  | 'recommendations_viewed'
  | 'routine_accepted'
  // Retention
  | 'weekly_return'
  | 'scan_again_clicked'
  | 'notification_enabled'
  | 'push_subscription_changed'
  // Commerce (future)
  | 'subscription_viewed'
  | 'upgrade_clicked'
  | 'conversion_completed'
  | 'churn';

export interface EventProperties {
  // Common
  user_id?: string;
  session_id?: string;
  source?: string;
  
  // Onboarding
  step?: string;
  step_number?: number;
  completion_percentage?: number;
  
  // Scans
  body_area?: string;
  quality_score?: number;
  rejection_reason?: string;
  scan_duration_ms?: number;
  
  // Recommendations
  recommendation_count?: number;
  routine_steps?: number;
  
  // Commerce
  plan?: string;
  price?: number;
  source_page?: string;
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  const analytics = getAnalytics();
  if (analytics) {
    analytics.track?.(eventName, properties);
  }
  
  // Always log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }
  
  // Also log to console in production for visibility
  if (process.env.NODE_ENV === 'production') {
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

export function trackOnboardingEvent(
  event: 'onboarding_started' | 'onboarding_step_completed' | 'onboarding_completed' | 'onboarding_abandoned',
  properties?: EventProperties
) {
  trackEvent(event, { ...properties, timestamp: new Date().toISOString() });
}

export function trackScanEvent(
  event: 'scan_initiated' | 'scan_quality_rejected' | 'scan_analyzed' | 'scan_completed' | 'scan_failed',
  properties?: EventProperties
) {
  trackEvent(event, { ...properties, timestamp: new Date().toISOString() });
}

export function trackRetentionEvent(
  event: 'weekly_return' | 'scan_again_clicked' | 'notification_enabled' | 'push_subscription_changed',
  properties?: EventProperties
) {
  trackEvent(event, { ...properties, timestamp: new Date().toISOString() });
}

export function trackConversionEvent(
  event: 'subscription_viewed' | 'upgrade_clicked' | 'conversion_completed' | 'churn',
  properties?: EventProperties
) {
  trackEvent(event, { ...properties, timestamp: new Date().toISOString() });
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
