import { Card } from "@/components/ui/card";
import type { ProposalResultPoint } from "@/lib/mock";

/*
  Resultados por propuesta — barras apiladas, tratamiento adaptado de la
  tarjeta "Quick Acs" de Hubmini. Doble lectura en cada barra:
   · ALTURA = participación (poder emitido sobre el total elegible)
   · SEGMENTOS = composición del voto (A Favor / En Contra / Abstención)
  Reutiliza la convención de color del app (ok=verde, due=rojo, faint=gris),
  la misma de components/proposals/results-bar.tsx, para no introducir un
  segundo lenguaje de color. La línea de umbral (51%) marca el quórum legal.
*/

const VIEW_W = 680;
const VIEW_H = 248;
const PAD_L = 30; // espacio para etiquetas del eje Y
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 28;
const QUORUM = 51;
const ELIGIBLE = 100_000;

const plotW = VIEW_W - PAD_L - PAD_R;
const plotH = VIEW_H - PAD_T - PAD_B;

export function ResultsChart({ data }: { data: ProposalResultPoint[] }) {
  const baseY = PAD_T + plotH;
  const y = (pct: number) => PAD_T + (1 - pct / 100) * plotH;

  const step = plotW / data.length;
  const barW = Math.min(38, step * 0.56);

  const rows = data.map((d) => {
    const cast = d.for + d.against + d.abstain;
    const turnout = (cast / ELIGIBLE) * 100;
    const approved = d.for / Math.max(cast, 1) > 0.5 && turnout >= QUORUM;
    return { ...d, cast, turnout, approved };
  });
  const quorumMet = rows.filter((r) => r.turnout >= QUORUM).length;
  const yThresh = y(QUORUM);

  const segColor = {
    for: "hsl(var(--ok))",
    against: "hsl(var(--due))",
    abstain: "hsl(var(--ink-faint))",
  };

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">
            Resultados por propuesta
          </h2>
          <p className="mt-0.5 text-xs text-ink-faint">
            Altura = participación · color = sentido del voto
          </p>
        </div>
        <span className="rounded-md border border-rule px-2.5 py-1 text-xs text-ink-soft">
          Últimas {data.length}
        </span>
      </div>

      {/* KPI + leyenda */}
      <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <p className="text-xs text-ink-faint">Alcanzaron quórum</p>
          <p className="font-display text-metric-val leading-none text-ink">
            {quorumMet}
            <span className="text-base text-ink-faint"> / {data.length}</span>
          </p>
        </div>
        <div className="ml-auto flex flex-col gap-1.5 text-xs text-ink-soft">
          {([
            ["for", "A Favor"],
            ["against", "En Contra"],
            ["abstain", "Abstención"],
          ] as const).map(([k, label]) => (
            <span key={k} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ background: segColor[k] }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mt-4 h-auto w-full"
        role="img"
        aria-label={`Resultados por propuesta: ${quorumMet} de ${data.length} alcanzaron el quórum del 51 por ciento. Cada barra muestra la participación y su composición entre votos a favor, en contra y abstención.`}
      >
        {/* Rejilla horizontal + etiquetas del eje Y */}
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line
              x1={PAD_L}
              y1={y(g)}
              x2={VIEW_W - PAD_R}
              y2={y(g)}
              style={{ stroke: "hsl(var(--rule))" }}
              strokeWidth={1}
              opacity={g === 0 ? 1 : 0.5}
            />
            <text
              x={PAD_L - 8}
              y={y(g) + 3}
              textAnchor="end"
              style={{ fill: "hsl(var(--ink-faint))" }}
              className="font-mono text-[9px]"
            >
              {g}%
            </text>
          </g>
        ))}

        {/* Umbral de quórum 51% */}
        <line
          x1={PAD_L}
          y1={yThresh}
          x2={VIEW_W - PAD_R}
          y2={yThresh}
          style={{ stroke: "hsl(var(--gold))" }}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text
          x={VIEW_W - PAD_R}
          y={yThresh - 5}
          textAnchor="end"
          style={{ fill: "hsl(var(--gold))" }}
          className="font-mono text-[10px]"
        >
          quórum 51%
        </text>

        {/* Barras apiladas */}
        {rows.map((r, i) => {
          const cx = PAD_L + step * i + step / 2;
          const x = cx - barW / 2;
          const scale = r.turnout / 100;
          const forH = (r.for / Math.max(r.cast, 1)) * r.turnout;
          const againstH = (r.against / Math.max(r.cast, 1)) * r.turnout;
          const abstainH = (r.abstain / Math.max(r.cast, 1)) * r.turnout;
          const pxFor = (forH / 100) * plotH;
          const pxAgainst = (againstH / 100) * plotH;
          const pxAbstain = (abstainH / 100) * plotH;
          const yFor = baseY - pxFor;
          const yAgainst = yFor - pxAgainst;
          const yAbstain = yAgainst - pxAbstain;
          return (
            <g key={r.label}>
              <rect x={x} y={yFor} width={barW} height={pxFor} style={{ fill: segColor.for }} />
              <rect x={x} y={yAgainst} width={barW} height={pxAgainst} style={{ fill: segColor.against }} />
              <rect x={x} y={yAbstain} width={barW} height={pxAbstain} rx={2} style={{ fill: segColor.abstain }} />
              {/* % de participación encima de la barra */}
              <text
                x={cx}
                y={yAbstain - 5}
                textAnchor="middle"
                style={{ fill: "hsl(var(--ink-soft))" }}
                className="font-mono text-[9px]"
              >
                {Math.round(r.turnout)}%
              </text>
              {/* etiqueta de propuesta */}
              <text
                x={cx}
                y={VIEW_H - 8}
                textAnchor="middle"
                style={{ fill: "hsl(var(--ink-faint))" }}
                className="font-mono text-[10px]"
              >
                {r.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}
