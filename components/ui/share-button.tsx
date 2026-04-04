'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Loader2 } from 'lucide-react';

export function ShareButton({ scanId }: { scanId: string }) {
  const [isSharing, setIsSharing] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, type: 'report' }),
      });

      if (!res.ok) throw new Error('Failed to generate share link');

      const data = await res.json();
      const shareUrl = `${window.location.origin}/s/${data.share_code}`;

      await navigator.clipboard.writeText(shareUrl);
      setHasCopied(true);

      setTimeout(() => setHasCopied(false), 3000);
      
    } catch (error) {
      console.error("Could not generate share link.", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleShare}
      disabled={isSharing}
      className="rounded-2xl h-12 font-bold px-6 bg-skin-surface border border-white/5 hover:bg-white/5 transition-all active:scale-95 text-content-primary"
    >
      {isSharing ? (
        <Loader2 className="mr-2 w-5 h-5 animate-spin text-skin-muted" />
      ) : hasCopied ? (
        <Check className="mr-2 w-5 h-5 text-skin-glow" />
      ) : (
        <Share2 className="mr-2 w-5 h-5 text-skin-violet" />
      )}
      {hasCopied ? "Copied Link" : "Share"}
    </Button>
  );
}
