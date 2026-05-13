import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { FinanceEntry } from "@/types";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function stripQuotes(s: string | undefined): string {
  if (!s) return "";
  const t = String(s).trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim();
  }
  return t;
}

const url = stripQuotes(rawUrl);
const key = stripQuotes(rawKey);

/** True when env vars look configured (even if client failed to construct). */
export const hadSupabaseEnv = Boolean(url && key);

let supabase: SupabaseClient | null = null;
export let supabaseBootstrapError: string | null = null;

if (url && key) {
  try {
    supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (e) {
    supabaseBootstrapError =
      e instanceof Error ? e.message : "Could not initialize Supabase client.";
  }
}

export { supabase };
export const supabaseConfigured = Boolean(supabase);

export function rowToEntry(r: Record<string, unknown>): FinanceEntry {
  const k = r.kind;
  const kind: FinanceEntry["kind"] =
    k === "income" || k === "expense" || k === "saving" ? k : "expense";
  return {
    id: String(r.id),
    person: String(r.person ?? ""),
    amount: Number(r.amount ?? 0),
    paid_amount: Number(r.paid_amount ?? 0),
    settled: Boolean(r.settled),
    notes: String(r.notes ?? ""),
    occurred_on: String(r.occurred_on ?? ""),
    kind,
    category: String(r.category ?? "General"),
    created_at: r.created_at ? String(r.created_at) : undefined,
  };
}

export function entryToRow(e: FinanceEntry): Record<string, unknown> {
  return {
    id: e.id,
    person: e.person,
    amount: e.amount,
    paid_amount: e.paid_amount,
    settled: e.settled,
    notes: e.notes,
    occurred_on: e.occurred_on,
    kind: e.kind,
    category: e.category,
  };
}
