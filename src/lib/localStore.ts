import type { FinanceEntry } from "@/types";
import { newId } from "@/lib/id";

const KEY = "finance_mobile_entries_v1";

function read(): FinanceEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as FinanceEntry[];
    return Array.isArray(parsed) ? parsed : seed();
  } catch {
    return seed();
  }
}

function write(rows: FinanceEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function seed(): FinanceEntry[] {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const rows: FinanceEntry[] = [
    {
      id: newId(),
      person: "Acme Supplies",
      amount: 420,
      paid_amount: 420,
      settled: true,
      notes: "Paint stock",
      occurred_on: iso(today),
      kind: "expense",
      category: "Inventory",
    },
    {
      id: newId(),
      person: "Walk-in Customer",
      amount: 180,
      paid_amount: 90,
      settled: false,
      notes: "Partial — balance due",
      occurred_on: iso(today),
      kind: "income",
      category: "Sales",
    },
    {
      id: newId(),
      person: "Emergency fund",
      amount: 500,
      paid_amount: 500,
      settled: true,
      notes: "Monthly allocation",
      occurred_on: iso(today),
      kind: "saving",
      category: "Savings",
    },
  ];
  write(rows);
  return rows;
}

type Listener = (rows: FinanceEntry[]) => void;
const listeners = new Set<Listener>();

export function localList(): FinanceEntry[] {
  return read();
}

export function localSubscribe(fn: Listener) {
  listeners.add(fn);
  fn(read());
  return () => listeners.delete(fn);
}

function emit() {
  const rows = read();
  for (const l of listeners) l(rows);
}

export function localUpsert(entry: FinanceEntry) {
  const rows = read();
  const i = rows.findIndex((r) => r.id === entry.id);
  if (i >= 0) rows[i] = entry;
  else rows.unshift(entry);
  write(rows);
  emit();
}

export function localDelete(id: string) {
  write(read().filter((r) => r.id !== id));
  emit();
}
