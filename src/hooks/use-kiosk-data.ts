import { useEffect, useState } from "react";
import { KioskDataSchema, type KioskData } from "@/lib/schema";

/**
 * Hook state shape — separates loading, valid data, and audit failures
 * so consumers can handle each case explicitly.
 */
export interface KioskDataState {
  data: KioskData | null;
  loading: boolean;
  /** Populated when Zod validation fails — contains human-readable field errors */
  auditError: string | null;
  /** Populated when the fetch itself fails (network error, 404, etc.) */
  fetchError: string | null;
}

// Module-level cache — avoids re-fetching on component remounts.
// Cleared automatically if the page is hard-refreshed.
let cache: KioskData | null = null;

export function useKioskData(): KioskDataState {
  const [state, setState] = useState<KioskDataState>({
    data: cache,
    loading: cache === null,
    auditError: null,
    fetchError: null,
  });

  useEffect(() => {
    if (cache) return;

    fetch("/kiosk-data.json")
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: failed to load kiosk-data.json`);
        }
        return r.json();
      })
      .then((rawData: unknown) => {
        // --- Audit Phase ---
        // safeParse never throws — it returns a discriminated union.
        const result = KioskDataSchema.safeParse(rawData);

        if (!result.success) {
          // Format Zod errors into a readable string for the UI
          const formatted = result.error.issues
            .map((issue) => `[${issue.path.join(".")}] ${issue.message}`)
            .join("\n");

          console.error(
            "❌ [Zapp3r Audit] Data Integrity Failure:\n" + formatted
          );

          setState({
            data: null,
            loading: false,
            auditError: formatted,
            fetchError: null,
          });
          return;
        }

        // Data passed validation — cache and set
        cache = result.data;
        setState({
          data: result.data,
          loading: false,
          auditError: null,
          fetchError: null,
        });
      })
      .catch((err: Error) => {
        console.error("❌ [Zapp3r] Fetch error:", err.message);
        setState({
          data: null,
          loading: false,
          auditError: null,
          fetchError: err.message,
        });
      });
  }, []);

  return state;
}
