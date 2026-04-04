"use client";

import { useState, useCallback } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Using a simple timeout-based approach
  // For production, consider using useSyncExternalStore
  if (typeof window !== "undefined") {
    let timeoutId: NodeJS.Timeout;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState(() => {
      timeoutId = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timeoutId);
    });
  }

  return debouncedValue;
}

export function useAsync<T>(asyncFunction: (...args: any[]) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err: any) {
        setError(err.message || "An error occurred");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  return { data, error, isLoading, execute };
}
