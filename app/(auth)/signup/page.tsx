"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo3D } from "@/components/ui/logo-3d";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "seller">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("claimToken");
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else {
      // If we have a claim token, link the scan now
      if (claimToken) {
         try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
               await fetch('/api/station/claim', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: claimToken, userId: user.id })
               });
            }
         } catch (e) {
            console.warn("[Signup] Failed to claim scan:", e);
         }
      }
      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center premium-gradient px-6 py-20 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 max-w-sm">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto shadow-xl">
             <CheckCircle2 className="text-content-primary w-10 h-10" />
          </div>
          <h2 className="text-3xl font-outfit font-black">Check Your Email</h2>
          <p className="text-content-muted font-medium">We've sent a magic link to {email} to confirm your account.</p>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">Back to Login</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center premium-gradient px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8 space-y-4">
          <Link href="/" className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Sparkles className="text-primary-foreground w-7 h-7" />
            </div>
            <Logo3D className="h-10 w-40" />
          </Link>
        </div>

        <Card className="border-none shadow-2xl glass">
          <CardHeader className="space-y-1 text-center pt-10 px-10">
            <CardTitle className="text-3xl font-black">Begin Your Journey</CardTitle>
            <CardDescription className="text-base font-medium">
              Create your account to unlock skin intelligence.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    role === "user" ? "border-primary bg-muted/50 ring-4 ring-primary/10" : "border-transparent bg-muted/50 opacity-60"
                  }`}
                >
                  <span className="font-bold text-sm">Consumer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    role === "seller" ? "border-secondary bg-muted/50 ring-4 ring-secondary/10" : "border-transparent bg-muted/50 opacity-60"
                  }`}
                >
                  <span className="font-bold text-sm">Seller</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-content-muted ml-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-content-muted ml-1">Password</label>
                <Input 
                  type="password" 
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-bold border border-destructive/20 text-center">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isLoading} variant={role === "user" ? "premium" : "secondary"}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="ml-2 w-5 h-5" /></>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-xs text-content-muted font-medium leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground">Terms</Link> and{" "}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-content-muted font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-primary-foreground font-black hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
