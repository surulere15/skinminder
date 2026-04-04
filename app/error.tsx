"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
    
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import("@sentry/nextjs").then((Sentry) => {
        Sentry.captureException(error);
      });
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6 shadow-xl">
             <AlertCircle size={32} />
          </div>
          <h2 className="text-3xl font-outfit font-black tracking-tight mb-2">Something went wrong</h2>
          <p className="text-muted max-w-md mx-auto mb-8">
             We're working on fixing this issue. Please try again.
          </p>
          <div className="flex gap-4">
             <Button variant="outline" onClick={() => window.location.href = "/"}>
                Go Home
             </Button>
             <Button onClick={() => reset()}>
                <RotateCcw className="mr-2 w-4 h-4" /> Try Again
             </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
