export function BarChart({
  labels,
  seriesA,
  seriesB,
  nameA,
  nameB,
}: {
  labels: string[];
  seriesA: number[];
  seriesB: number[];
  nameA: string;
  nameB: string;
}) {
  const max = Math.max(1, ...seriesA, ...seriesB);
  return (
    <figure className="barchart" aria-label="Monthly comparison">
      <div className="barchart__legend">
        <span>
          <i className="dot dot--a" /> {nameA}
        </span>
        <span>
          <i className="dot dot--b" /> {nameB}
        </span>
      </div>
      <div className="barchart__grid">
        {labels.map((lb, i) => {
          const a = seriesA[i] ?? 0;
          const b = seriesB[i] ?? 0;
          const ha = Math.round((a / max) * 100);
          const hb = Math.round((b / max) * 100);
          return (
            <div key={lb} className="barchart__col">
              <div className="barchart__bars" aria-label={`${lb}`}>
                <div
                  className="barchart__bar barchart__bar--a"
                  style={{ height: `${ha}%` }}
                  title={`${nameA}: ${a}`}
                />
                <div
                  className="barchart__bar barchart__bar--b"
                  style={{ height: `${hb}%` }}
                  title={`${nameB}: ${b}`}
                />
              </div>
              <span className="barchart__label">{lb}</span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
