import { useMemo, useState } from "react";
import type { FinanceEntry } from "@/types";
import type { CurrencyType } from "@/lib/currency";
import { formatMoney, getAllCurrencies } from "@/lib/currency";
import { Screen, StatCard } from "@/components/Layout";
import { Icon } from "@/components/Icon";
import { entriesToCsv, downloadCsv } from "@/lib/csv";
import { useDerivedStats } from "@/hooks/useFinance";

export function ProfileScreen({
  entries,
  mode,
  currency,
  onCurrencyChange,
}: {
  entries: FinanceEntry[];
  mode: "supabase" | "local";
  currency: CurrencyType;
  onCurrencyChange: (currency: CurrencyType) => void;
}) {
  const stats = useDerivedStats(entries);
  const [busy, setBusy] = useState(false);

  const stamp = useMemo(
    () => new Date().toISOString().replace(/[:.]/g, "-"),
    [],
  );

  const exportCsv = () => {
    setBusy(true);
    try {
      const csv = entriesToCsv(entries);
      downloadCsv(`finance-export-${stamp}.csv`, csv);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      title="Profile"
      subtitle="Overview and data portability"
      actions={null}
    >
      <section className="panel profile-hero" aria-label="Financial overview">
        <div className="profile-hero__icon" aria-hidden>
          <Icon name="shield" size={28} />
        </div>
        <p className="profile-hero__label">All-time net position</p>
        <p className="profile-hero__value">
          {formatMoney(stats.income - stats.expense + stats.saving, currency)}
        </p>
        <p className="muted">
          Storage: {mode === "supabase" ? "Supabase (live sync)" : "Local device"}
        </p>
      </section>

      <div className="grid2">
        <StatCard
          title="Transactions"
          value={`${stats.count - stats.savingsCount}`}
          hint="Income + expenses"
          icon="list"
          tone="neutral"
        />
        <StatCard
          title="Savings lines"
          value={`${stats.savingsCount}`}
          icon="piggy"
          tone="accent"
        />
      </div>

      <section className="panel" aria-labelledby="currency-heading">
        <div className="panel__head">
          <h2 id="currency-heading" className="panel__title">
            Currency
          </h2>
        </div>
        <p className="muted">Select your preferred currency for display.</p>
        <div className="seg seg--block" role="tablist" aria-label="Currency selection">
          {getAllCurrencies().map((c) => (
            <button
              key={c}
              type="button"
              className={`seg__btn${currency === c ? " seg__btn--on" : ""}`}
              onClick={() => onCurrencyChange(c)}
              aria-pressed={currency === c}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="panel" aria-labelledby="export-heading">
        <div className="panel__head">
          <h2 id="export-heading" className="panel__title">
            Records
          </h2>
        </div>
        <p className="muted">
          Export a CSV with timestamps in the filename for bookkeeping or backups.
        </p>
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={exportCsv}
          disabled={busy || entries.length === 0}
          aria-busy={busy}
        >
          <Icon name="download" size={18} /> Export CSV
        </button>
      </section>
    </Screen>
  );
}
