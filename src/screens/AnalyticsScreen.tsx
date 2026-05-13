import { useMemo } from "react";
import type { FinanceEntry } from "@/types";
import { Screen, StatCard } from "@/components/Layout";
import { BarChart } from "@/components/BarChart";
import {
  useDerivedStats,
  useMonthlyBuckets,
  useTopContacts,
} from "@/hooks/useFinance";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function AnalyticsScreen({ entries }: { entries: FinanceEntry[] }) {
  const { labels, income, expense } = useMonthlyBuckets(entries, 6);
  const top = useTopContacts(entries, 5);
  const totals = useDerivedStats(entries);

  const averages = useMemo(() => {
    const months = 6;
    const simpleInc = income.reduce((a, b) => a + b, 0) / months;
    const simpleExp = expense.reduce((a, b) => a + b, 0) / months;
    return { simpleInc, simpleExp };
  }, [income, expense]);

  return (
    <Screen
      title="Analytics"
      subtitle="Six month comparison and top relationships"
      actions={null}
    >
      <section className="panel" aria-labelledby="chart-heading">
        <div className="panel__head">
          <h2 id="chart-heading" className="panel__title">
            Income vs expenses
          </h2>
        </div>
        <BarChart
          labels={labels}
          seriesA={income}
          seriesB={expense}
          nameA="Income"
          nameB="Expenses"
        />
      </section>

      <div className="grid2">
        <StatCard
          title="Avg monthly income"
          value={money(averages.simpleInc)}
          icon="wallet"
          tone="good"
        />
        <StatCard
          title="Avg monthly expenses"
          value={money(averages.simpleExp)}
          icon="receipt"
          tone="bad"
        />
      </div>

      <section className="panel" aria-labelledby="top-heading">
        <div className="panel__head">
          <h2 id="top-heading" className="panel__title">
            Top contacts by volume
          </h2>
        </div>
        <ol className="rank">
          {top.map((row, i) => (
            <li key={row.person} className="rank__row">
              <span className="rank__idx">{i + 1}</span>
              <span className="rank__name">{row.person}</span>
              <span className="rank__val">{money(row.total)}</span>
            </li>
          ))}
          {top.length === 0 ? (
            <li className="empty">Add income or expense entries to see leaders.</li>
          ) : null}
        </ol>
      </section>

      <section className="panel" aria-label="Trend summary">
        <div className="panel__head">
          <h2 className="panel__title">Snapshot</h2>
        </div>
        <p className="muted">
          {totals.count} total entries · {totals.savingsCount} savings lines ·{" "}
          {totals.settled} settled.
        </p>
      </section>
    </Screen>
  );
}
