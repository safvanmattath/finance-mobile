import { useCallback, useEffect, useMemo, useState } from "react";
import type { FinanceEntry } from "@/types";
import { entryToRow, rowToEntry, supabase, supabaseConfigured } from "@/lib/supabase";
import {
  localDelete,
  localList,
  localSubscribe,
  localUpsert,
} from "@/lib/localStore";

export interface FinanceApi {
  entries: FinanceEntry[];
  loading: boolean;
  error: string | null;
  mode: "supabase" | "local";
  refresh: () => Promise<void>;
  upsert: (e: FinanceEntry) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useFinance(): FinanceApi {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mode = supabaseConfigured ? "supabase" : "local";

  const loadSupabase = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("finance_entries")
      .select("*")
      .order("occurred_on", { ascending: false });
    if (err) {
      setError(err.message);
      setEntries([]);
    } else {
      setEntries((data ?? []).map((r) => rowToEntry(r as Record<string, unknown>)));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (supabaseConfigured && supabase) {
      void loadSupabase();
      const ch = supabase
        .channel("finance_entries_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "finance_entries" },
          () => {
            void loadSupabase();
          },
        )
        .subscribe();
      return () => {
        void supabase.removeChannel(ch);
      };
    }
    const unsub = localSubscribe(setEntries);
    setLoading(false);
    return unsub;
  }, [loadSupabase]);

  const upsert = useCallback(
    async (e: FinanceEntry) => {
      if (supabaseConfigured && supabase) {
        setError(null);
        const row = entryToRow(e);
        const { error: err } = await supabase.from("finance_entries").upsert(row);
        if (err) {
          setError(err.message);
          throw err;
        }
        await loadSupabase();
        return;
      }
      localUpsert(e);
    },
    [loadSupabase],
  );

  const remove = useCallback(
    async (id: string) => {
      if (supabaseConfigured && supabase) {
        setError(null);
        const { error: err } = await supabase.from("finance_entries").delete().eq("id", id);
        if (err) {
          setError(err.message);
          throw err;
        }
        await loadSupabase();
        return;
      }
      localDelete(id);
    },
    [loadSupabase],
  );

  const refresh = useCallback(async () => {
    if (supabaseConfigured && supabase) {
      await loadSupabase();
      return;
    }
    setEntries(localList());
  }, [loadSupabase]);

  return useMemo(
    () => ({ entries, loading, error, mode, refresh, upsert, remove }),
    [entries, loading, error, mode, refresh, upsert, remove],
  );
}

export function useDerivedStats(entries: FinanceEntry[]) {
  return useMemo(() => {
    let income = 0;
    let expense = 0;
    let saving = 0;
    let settled = 0;
    for (const e of entries) {
      if (e.kind === "income") income += e.amount;
      else if (e.kind === "expense") expense += e.amount;
      else saving += e.amount;
      if (e.settled) settled += 1;
    }
    const net = income - expense;
    const savingsCount = entries.filter((e) => e.kind === "saving").length;
    return { income, expense, saving, settled, net, savingsCount, count: entries.length };
  }, [entries]);
}

export function useMonthlyBuckets(entries: FinanceEntry[], months = 6) {
  return useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const income: number[] = [];
    const expense: number[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      labels.push(
        d.toLocaleString(undefined, { month: "short", year: "2-digit" }),
      );
      let inc = 0;
      let exp = 0;
      for (const e of entries) {
        if (!e.occurred_on.startsWith(key)) continue;
        if (e.kind === "income") inc += e.amount;
        else if (e.kind === "expense") exp += e.amount;
      }
      income.push(inc);
      expense.push(exp);
    }
    return { labels, income, expense };
  }, [entries, months]);
}

export function useTopContacts(entries: FinanceEntry[], top = 5) {
  return useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      if (e.kind === "saving") continue;
      map.set(e.person, (map.get(e.person) ?? 0) + e.amount);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, top)
      .map(([person, total]) => ({ person, total }));
  }, [entries, top]);
}
