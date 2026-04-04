"use client";

import { useEffect, useCallback } from "react";
import { 
  trackEvent, 
  trackPageView, 
  trackOnboardingEvent, 
  trackScanEvent,
  trackRetentionEvent,
  trackConversionEvent,
  type SkinMinderEvent,
  type EventProperties
} from "./analytics";

export function useAnalytics() {
  const track = useCallback((event: SkinMinderEvent, properties?: EventProperties) => {
    trackEvent(event, properties);
  }, []);

  const page = useCallback((url: string) => {
    trackPageView(url);
  }, []);

  const onboarding = useCallback((event: 'onboarding_started' | 'onboarding_step_completed' | 'onboarding_completed' | 'onboarding_abandoned', properties?: EventProperties) => {
    trackOnboardingEvent(event, properties);
  }, []);

  const scan = useCallback((event: 'scan_initiated' | 'scan_quality_rejected' | 'scan_analyzed' | 'scan_completed' | 'scan_failed', properties?: EventProperties) => {
    trackScanEvent(event, properties);
  }, []);

  const retention = useCallback((event: 'weekly_return' | 'scan_again_clicked' | 'notification_enabled' | 'push_subscription_changed', properties?: EventProperties) => {
    trackRetentionEvent(event, properties);
  }, []);

  const conversion = useCallback((event: 'subscription_viewed' | 'upgrade_clicked' | 'conversion_completed' | 'churn', properties?: EventProperties) => {
    trackConversionEvent(event, properties);
  }, []);

  return { track, page, onboarding, scan, retention, conversion };
}

export function usePageView(url: string) {
  useEffect(() => {
    trackPageView(url);
  }, [url]);
}