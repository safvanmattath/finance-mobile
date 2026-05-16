export type EntryKind = "income" | "expense" | "saving";
export type CurrencyType = "INR" | "AED";

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
  currency?: CurrencyType;
  created_at?: string;
}

export type FilterTab = "all" | "income" | "expense" | "saving";
