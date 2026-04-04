"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Not authenticated");
          setIsLoading(false);
          return;
        }

        const { data, error: dbError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dbError) throw dbError;
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const updateProfile = async (updates: Record<string, any>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: dbError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (dbError) throw dbError;
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { profile, isLoading, error, updateProfile };
}
