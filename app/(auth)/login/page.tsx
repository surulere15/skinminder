"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Logo3D } from "@/components/ui/logo-3d";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

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

        <Card className="border-none shadow-2xl bg-skin-surface p-4">
          <CardHeader className="space-y-1 text-center pt-6">
            <CardTitle className="text-3xl font-black text-content-primary">Welcome Back</CardTitle>
            <CardDescription className="text-base font-medium text-content-secondary">
              Continue your skin intelligence journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-content-primary ml-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-black uppercase tracking-widest text-content-primary">Password</label>
                  <Link href="#" className="text-xs font-bold text-content-primary hover:underline">Forgot password?</Link>
                </div>
                <Input 
                  type="password" 
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

              <Button type="submit" size="lg" className="w-full" disabled={isLoading} variant="premium">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-content-primary font-medium">
                Don't have an account?{" "}
                <Link href="/signup" className="text-content-primary font-black hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
