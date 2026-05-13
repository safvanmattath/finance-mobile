export function ProgressBar({
  value,
  max,
  tone = "brand",
  label,
}: {
  value: number;
  max: number;
  tone?: "brand" | "good" | "warn";
  label?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="progress" aria-label={label ?? "Progress"}>
      <div
        className={`progress__track progress__track--${tone}`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        role="progressbar"
      >
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress__meta">
        <span>{pct}%</span>
        <span className="progress__nums">
          {value.toFixed(0)} / {max.toFixed(0)}
        </span>
      </div>
    </div>
  );
}
