import type { FinanceEntry } from "@/types";

export function entriesToCsv(rows: FinanceEntry[]): string {
  const header = [
    "id",
    "person",
    "amount",
    "paid_amount",
    "settled",
    "notes",
    "occurred_on",
    "kind",
    "category",
  ];
  const esc = (v: string | number | boolean) => {
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        esc(r.id),
        esc(r.person),
        esc(r.amount),
        esc(r.paid_amount),
        esc(r.settled),
        esc(r.notes),
        esc(r.occurred_on),
        esc(r.kind),
        esc(r.category),
      ].join(","),
    );
  }
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}
