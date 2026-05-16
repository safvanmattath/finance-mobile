import { useMemo } from "react";
import type { FinanceEntry } from "@/types";
import type { CurrencyType } from "@/lib/currency";
import { formatMoney } from "@/lib/currency";
import { Screen, StatCard } from "@/components/Layout";
import { ProgressBar } from "@/components/ProgressBar";
import { Icon } from "@/components/Icon";

function netWindow(
  entries: FinanceEntry[],
  startOffset: number,
  endOffset: number,
) {
  const end = new Date();
  const windowEnd = new Date(end);
  windowEnd.setDate(end.getDate() - startOffset);
  const windowStart = new Date(end);
  windowStart.setDate(end.getDate() - endOffset);
  const inR = (d: string) => {
    const t = new Date(d + "T12:00:00");
    return t >= windowStart && t <= windowEnd;
  };
  let inc = 0;
  let exp = 0;
  for (const e of entries) {
    if (!inR(e.occurred_on)) continue;
    if (e.kind === "income") inc += e.amount;
    else if (e.kind === "expense") exp += e.amount;
  }
  return inc - exp;
}

export function HomeScreen({
  entries,
  onOpen,
  currency,
}: {
  entries: FinanceEntry[];
  onOpen: (e: FinanceEntry) => void;
  currency: CurrencyType;
}) {
  const stats = useMemo(() => {
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
    const netWealth = income - expense + saving;
    const recent = netWindow(entries, 0, 14);
    const previous = netWindow(entries, 14, 28);
    const trend =
      recent === previous ? "flat" : recent > previous ? "up" : "down";
    return { income, expense, saving, settled, netWealth, trend, recent, previous };
  }, [entries]);

  const recentFive = useMemo(() => {
    return [...entries]
      .sort((a, b) => (a.occurred_on < b.occurred_on ? 1 : -1))
      .slice(0, 5);
  }, [entries]);

  return (
    <Screen
      title="Dashboard"
      subtitle="Net position, cash flow, and recent activity"
      actions={null}
    >
      <section className="hero" aria-label="Net wealth">
        <div className="hero__row">
          <p className="hero__label">Net wealth</p>
          <span
            className={`pill pill--${stats.trend}`}
            aria-label={`Trend ${stats.trend}`}
          >
            {stats.trend === "up" ? (
              <>
                <Icon name="trendUp" size={16} /> Up
              </>
            ) : stats.trend === "down" ? (
              <>
                <Icon name="trendDown" size={16} /> Down
              </>
            ) : (
              <>
                <Icon name="minus" size={16} /> Steady
              </>
            )}
          </span>
        </div>
        <p className="hero__value">{formatMoney(stats.netWealth, currency)}</p>
        <p className="hero__hint">
          Income − expenses + savings. Short-term trend compares rolling windows.
        </p>
      </section>

      <div className="grid2">
        <StatCard
          title="Income"
          value={formatMoney(stats.income, currency)}
          icon="arrowUp"
          tone="good"
        />
        <StatCard
          title="Expenses"
          value={formatMoney(stats.expense, currency)}
          icon="arrowDown"
          tone="bad"
        />
        <StatCard
          title="Savings"
          value={formatMoney(stats.saving, currency)}
          icon="piggy"
          tone="accent"
        />
        <StatCard
          title="Settled"
          value={`${stats.settled}`}
          hint="Entries marked complete"
          icon="check"
          tone="neutral"
        />
      </div>

      <section className="panel" aria-labelledby="recent-heading">
        <div className="panel__head">
          <h2 id="recent-heading" className="panel__title">
            Recent activity
          </h2>
        </div>
        <ul className="list">
          {recentFive.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                className="rowbtn"
                onClick={() => onOpen(e)}
                aria-label={`Open ${e.person}`}
              >
                <div className="rowbtn__main">
                  <span className={`badge badge--${e.kind}`}>{e.kind}</span>
                  <div>
                    <p className="rowbtn__title">{e.person}</p>
                    <p className="rowbtn__sub">
                      {e.category} · {e.occurred_on}
                    </p>
                  </div>
                </div>
                <div className="rowbtn__side">
                  <span className="rowbtn__amt">{formatMoney(e.amount, currency)}</span>
                  {e.amount > 0 && e.paid_amount < e.amount ? (
                    <ProgressBar
                      value={e.paid_amount}
                      max={e.amount}
                      tone={e.kind === "expense" ? "warn" : "brand"}
                      label={`Payment progress for ${e.person}`}
                    />
                  ) : null}
                </div>
              </button>
            </li>
          ))}
          {recentFive.length === 0 ? (
            <li className="empty">No entries yet. Add one with the + button.</li>
          ) : null}
        </ul>
      </section>
    </Screen>
  );
}
