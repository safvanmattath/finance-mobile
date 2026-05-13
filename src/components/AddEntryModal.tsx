import { useState } from "react";
import type { EntryKind, FinanceEntry } from "@/types";
import { newId } from "@/lib/id";
import { Icon } from "@/components/Icon";

export function AddEntryModal({
  open,
  onClose,
  onSave,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (e: FinanceEntry) => Promise<void>;
  busy: boolean;
}) {
  const [kind, setKind] = useState<EntryKind>("expense");
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("General");
  const [occurredOn, setOccurredOn] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [settled, setSettled] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setKind("expense");
    setPerson("");
    setAmount("");
    setPaid("");
    setNotes("");
    setCategory("General");
    setOccurredOn(new Date().toISOString().slice(0, 10));
    setSettled(false);
    setErr(null);
  };

  const submit = async () => {
    setErr(null);
    const p = person.trim();
    const a = Number(amount);
    const pd = paid.trim() === "" ? 0 : Number(paid);
    if (!p) {
      setErr("Contact or title is required.");
      return;
    }
    if (!Number.isFinite(a) || a <= 0) {
      setErr("Amount must be a positive number.");
      return;
    }
    if (!Number.isFinite(pd) || pd < 0) {
      setErr("Paid amount must be zero or more.");
      return;
    }
    if (pd > a) {
      setErr("Paid amount cannot exceed the total.");
      return;
    }
    if (!occurredOn) {
      setErr("Date is required.");
      return;
    }
    const entry: FinanceEntry = {
      id: newId(),
      person: p,
      amount: a,
      paid_amount: pd,
      settled: settled || pd >= a,
      notes: notes.trim(),
      occurred_on: occurredOn,
      kind,
      category: category.trim() || "General",
    };
    try {
      await onSave(entry);
      reset();
      onClose();
    } catch {
      setErr("Could not save. Check your connection and try again.");
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-entry-title"
      >
        <div className="modal__head">
          <h2 id="add-entry-title">Add entry</h2>
          <button
            type="button"
            className="iconbtn"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="modal__body">
          {err ? (
            <p className="banner banner--err" role="alert">
              <Icon name="alert" size={18} /> {err}
            </p>
          ) : null}
          <label className="field">
            <span>Type</span>
            <div className="seg" role="tablist" aria-label="Entry type">
              {(
                [
                  ["income", "Income"],
                  ["expense", "Expense"],
                  ["saving", "Saving"],
                ] as const
              ).map(([k, lab]) => (
                <button
                  key={k}
                  type="button"
                  className={`seg__btn${kind === k ? " seg__btn--on" : ""}`}
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                >
                  {lab}
                </button>
              ))}
            </div>
          </label>
          <label className="field">
            <span>Person / title</span>
            <input
              className="input"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              autoComplete="off"
              placeholder="Who or what is this for?"
            />
          </label>
          <label className="field">
            <span>Category</span>
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Sales, Rent, Savings"
            />
          </label>
          <div className="fieldgrid">
            <label className="field">
              <span>Total amount</span>
              <input
                className="input"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </label>
            <label className="field">
              <span>Paid so far</span>
              <input
                className="input"
                inputMode="decimal"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
                placeholder="Partial payments"
              />
            </label>
          </div>
          <label className="field">
            <span>Date</span>
            <input
              className="input"
              type="date"
              value={occurredOn}
              onChange={(e) => setOccurredOn(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea
              className="input input--area"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional context"
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={settled}
              onChange={(e) => setSettled(e.target.checked)}
            />
            <span>Mark as fully settled</span>
          </label>
        </div>
        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => void submit()}
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
