import { useCallback } from 'react';
import { trackEvent, trackPageView } from '@/lib/analytics';

export function useAnalytics() {
  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    trackEvent(eventName, properties);
  }, []);

  const pageView = useCallback((url: string) => {
    trackPageView(url);
  }, []);

  return { trackEvent: track, trackPageView: pageView };
}
