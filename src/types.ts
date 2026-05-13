export type EntryKind = "income" | "expense" | "saving";

export interface FinanceEntry {
  id: string;
  person: string;
  amount: number;
  paid_amount: number;
  settled: boolean;
  notes: string;
  occurred_on: string;
  kind: EntryKind;
  category: string;
  created_at?: string;
}

export type FilterTab = "all" | "income" | "expense" | "saving";
