import { formatNumber, formatPercent } from "@/lib/utils";
import type { ProposalTally } from "@/types";

/**
 * Visualizador de resultados en tiempo real. Lee el conteo del contrato
 * (A Favor / En Contra / Abstención) como una sola barra proporcional.
 */
export function ResultsBar({ tally }: { tally: ProposalTally }) {
  const total = Math.max(1, tally.totalCast);
  const seg = [
    { key: "for", label: "A Favor", value: tally.for, cls: "bg-ok" },
    { key: "against", label: "En Contra", value: tally.against, cls: "bg-due" },
    { key: "abstain", label: "Abstención", value: tally.abstain, cls: "bg-ink-faint" },
  ];

  return (
    <div>
      <div
        className="flex h-3 w-full overflow-hidden rounded-full bg-ink/10"
        role="img"
        aria-label={`A favor ${formatPercent((tally.for / total) * 100)}, en contra ${formatPercent(
          (tally.against / total) * 100
        )}, abstención ${formatPercent((tally.abstain / total) * 100)}`}
      >
        {seg.map((s) => (
          <div
            key={s.key}
            className={`${s.cls} h-full transition-[width] duration-700`}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 font-tnum">
        {seg.map((s) => (
          <div key={s.key}>
            <dt className="flex items-center gap-1.5 text-xs text-ink-soft">
              <span className={`size-2.5 rounded-sm ${s.cls}`} />
              {s.label}
            </dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-ink">
              {formatPercent((s.value / total) * 100, 0)}
            </dd>
            <dd className="text-xs text-ink-faint">{formatNumber(s.value, 0)} votos</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
