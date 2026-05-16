import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { AddEntryModal } from "@/components/AddEntryModal";
import { ActionSheet } from "@/components/ActionSheet";
import { Icon } from "@/components/Icon";
import { useFinance } from "@/hooks/useFinance";
import type { FinanceEntry } from "@/types";
import type { CurrencyType } from "@/lib/currency";
import { HomeScreen } from "@/screens/HomeScreen";
import { TransfersScreen } from "@/screens/TransfersScreen";
import { AnalyticsScreen } from "@/screens/AnalyticsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";

type Tab = "home" | "transfers" | "analytics" | "profile";

export default function App() {
  const finance = useFinance();
  const [tab, setTab] = useState<Tab>("home");
  const [addOpen, setAddOpen] = useState(false);
  const [active, setActive] = useState<FinanceEntry | null>(null);
  const [busy, setBusy] = useState(false);
  const [currency, setCurrency] = useState<CurrencyType>("INR");

  const onSave = async (e: FinanceEntry) => {
    setBusy(true);
    try {
      await finance.upsert(e);
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    setBusy(true);
    try {
      await finance.remove(id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__logo" aria-hidden>
            <Icon name="spark" />
          </span>
          <div>
            <p className="topbar__title">Finance</p>
            <p className="topbar__sub">
              {finance.mode === "supabase" ? "Live sync" : "Offline demo"}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="fab"
          onClick={() => setAddOpen(true)}
          aria-label="Add transaction or saving"
        >
          <Icon name="plus" size={26} />
        </button>
      </header>

      {finance.error ? (
        <div className="banner banner--err banner--sticky" role="alert">
          <Icon name="alert" size={18} /> {finance.error}
        </div>
      ) : null}

      <main id="main" className="main">
        {finance.loading ? (
          <p className="loading" role="status" aria-live="polite">
            Loading your ledger…
          </p>
        ) : null}
        {!finance.loading && tab === "home" ? (
          <HomeScreen entries={finance.entries} onOpen={setActive} currency={currency} />
        ) : null}
        {!finance.loading && tab === "transfers" ? (
          <TransfersScreen entries={finance.entries} onOpen={setActive} currency={currency} />
        ) : null}
        {!finance.loading && tab === "analytics" ? (
          <AnalyticsScreen entries={finance.entries} currency={currency} />
        ) : null}
        {!finance.loading && tab === "profile" ? (
          <ProfileScreen entries={finance.entries} mode={finance.mode} currency={currency} onCurrencyChange={setCurrency} />
        ) : null}
      </main>

      <BottomNav active={tab} onChange={setTab} />

      <AddEntryModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={onSave}
        busy={busy}
      />
      <ActionSheet
        entry={active}
        onClose={() => setActive(null)}
        onSave={onSave}
        onDelete={onDelete}
        busy={busy}
      />
    </div>
  );
}
