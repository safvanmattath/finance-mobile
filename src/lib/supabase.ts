import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { FinanceEntry } from "@/types";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigured = Boolean(url && key);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, key!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

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
