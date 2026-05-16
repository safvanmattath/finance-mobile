import { useMemo, useState } from "react";
import type { FilterTab, FinanceEntry } from "@/types";
import type { CurrencyType } from "@/lib/currency";
import { formatMoney } from "@/lib/currency";
import { Screen } from "@/components/Layout";
import { ProgressBar } from "@/components/ProgressBar";
import { Icon } from "@/components/Icon";

const tabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expenses" },
  { id: "saving", label: "Savings" },
];

export function TransfersScreen({
  entries,
  onOpen,
  currency,
}: {
  entries: FinanceEntry[];
  onOpen: (e: FinanceEntry) => void;
  currency: CurrencyType;
}) {
  const [tab, setTab] = useState<FilterTab>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...entries]
      .filter((e) => (tab === "all" ? true : e.kind === tab))
      .filter((e) => {
        if (!needle) return true;
        return (
          e.person.toLowerCase().includes(needle) ||
          e.notes.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => (a.occurred_on < b.occurred_on ? 1 : -1));
  }, [entries, tab, q]);

  return (
    <Screen
      title="Transfers"
      subtitle="Search, filter, and manage entries"
      actions={null}
    >
      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={20} />
          <input
            className="search__input"
            placeholder="Search person or notes"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search transfers"
            autoComplete="off"
          />
        </label>
        <div className="seg seg--scroll" role="tablist" aria-label="Category filter">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`seg__btn${tab === t.id ? " seg__btn--on" : ""}`}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="list list--flush">
        {filtered.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              className="rowbtn rowbtn--tall"
              onClick={() => onOpen(e)}
              aria-label={`Open ${e.person}`}
            >
              <div className="rowbtn__main">
                <span className={`badge badge--${e.kind}`}>{e.kind}</span>
                <div>
                  <p className="rowbtn__title">{e.person}</p>
                  <p className="rowbtn__sub">
                    {e.notes || "—"} · {e.occurred_on}
                  </p>
                </div>
              </div>
              <div className="rowbtn__side">
                <span className="rowbtn__amt">{formatMoney(e.amount, currency)}</span>
                {e.paid_amount < e.amount ? (
                  <ProgressBar
                    value={e.paid_amount}
                    max={e.amount}
                    tone={e.kind === "expense" ? "warn" : "brand"}
                    label={`Paid progress for ${e.person}`}
                  />
                ) : (
                  <span className={`pill pill--${e.settled ? "up" : "flat"}`}>
                    {e.settled ? "Settled" : "Open"}
                  </span>
                )}
              </div>
            </button>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="empty">No matches for this filter.</li>
        ) : null}
      </ul>
    </Screen>
  );
}
