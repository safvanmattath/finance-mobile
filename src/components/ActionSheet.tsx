import { useEffect, useState } from "react";
import type { FinanceEntry } from "@/types";
import { Icon } from "@/components/Icon";

export function ActionSheet({
  entry,
  onClose,
  onSave,
  onDelete,
  busy,
}: {
  entry: FinanceEntry | null;
  onClose: () => void;
  onSave: (e: FinanceEntry) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  busy: boolean;
}) {
  const [paid, setPaid] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!entry) return;
    setPaid(String(entry.paid_amount));
    setErr(null);
  }, [entry]);

  if (!entry) return null;

  const applyPaid = async () => {
    setErr(null);
    const pd = Number(paid);
    if (!Number.isFinite(pd) || pd < 0) {
      setErr("Paid amount invalid.");
      return;
    }
    if (pd > entry.amount) {
      setErr("Paid cannot exceed total.");
      return;
    }
    const next: FinanceEntry = {
      ...entry,
      paid_amount: pd,
      settled: pd >= entry.amount,
    };
    await onSave(next);
    onClose();
  };

  const toggleSettled = async () => {
    const nextSettled = !entry.settled;
    await onSave({
      ...entry,
      settled: nextSettled,
      paid_amount: nextSettled
        ? entry.amount
        : Math.min(entry.paid_amount, entry.amount),
    });
    onClose();
  };

  const del = async () => {
    if (
      !window.confirm(
        "Delete this entry? This cannot be undone in local mode without a backup.",
      )
    ) {
      return;
    }
    await onDelete(entry.id);
    onClose();
  };

  return (
    <div
      className="sheet-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Entry actions"
      >
        <div className="sheet__grab" aria-hidden />
        <header className="sheet__head">
          <div>
            <p className="sheet__kicker">{entry.kind.toUpperCase()}</p>
            <h2 className="sheet__title">{entry.person}</h2>
            <p className="sheet__meta">
              {entry.category} · {entry.occurred_on}
            </p>
          </div>
          <button type="button" className="iconbtn" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </header>
        {err ? (
          <p className="banner banner--err" role="alert">
            {err}
          </p>
        ) : null}
        <div className="sheet__block">
          <label className="field">
            <span>Update paid amount</span>
            <input
              className="input"
              inputMode="decimal"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => void applyPaid()}
            disabled={busy}
          >
            <Icon name="edit" size={18} /> Apply payment
          </button>
        </div>
        <div className="sheet__actions">
          <button
            type="button"
            className="btn btn--ghost btn--block"
            onClick={() => void toggleSettled()}
            disabled={busy}
          >
            <Icon name={entry.settled ? "minus" : "check"} size={18} />{" "}
            {entry.settled ? "Mark unsettled" : "Mark settled"}
          </button>
          <button
            type="button"
            className="btn btn--danger btn--block"
            onClick={() => void del()}
            disabled={busy}
          >
            <Icon name="trash" size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
