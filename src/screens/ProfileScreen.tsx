import { useMemo, useState } from "react";
import type { FinanceEntry } from "@/types";
import { Screen, StatCard } from "@/components/Layout";
import { Icon } from "@/components/Icon";
import { entriesToCsv, downloadCsv } from "@/lib/csv";
import { useDerivedStats } from "@/hooks/useFinance";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function ProfileScreen({
  entries,
  mode,
}: {
  entries: FinanceEntry[];
  mode: "supabase" | "local";
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
          {money(stats.income - stats.expense + stats.saving)}
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
