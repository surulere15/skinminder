"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useScanHistory(limit = 10) {
  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadScans() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Not authenticated");
          setIsLoading(false);
          return;
        }

        const { data, error: dbError } = await supabase
          .from("skin_scans")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (dbError) throw dbError;
        setScans(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadScans();
  }, [limit]);

  return { scans, isLoading, error };
}

export function useScanById(scanId: string) {
  const [scan, setScan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadScan() {
      if (!scanId) return;
      try {
        const { data, error: dbError } = await supabase
          .from("skin_scans")
          .select("*")
          .eq("id", scanId)
          .single();

        if (dbError) throw dbError;
        setScan(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadScan();
  }, [scanId]);

  return { scan, isLoading, error };
}
