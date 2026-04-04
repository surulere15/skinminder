'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { trackEvent } from '@/lib/analytics';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
    trackEvent('cookie_consent_accepted');
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
    trackEvent('cookie_consent_declined');
  };

  if (!mounted || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          We use cookies to analyze usage and improve your experience. By clicking &quot;Accept&quot;, you consent to our use of cookies.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
