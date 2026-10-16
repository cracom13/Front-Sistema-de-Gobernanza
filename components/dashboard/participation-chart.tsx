import { Card } from "@/components/ui/card";
import type { ParticipationPoint } from "@/lib/mock";

/*
  Gráfica de participación por asamblea — tratamiento "área + proyección"
  adaptado del dashboard Hubmini, recoloreado a la identidad vinotinto.

  Dibujada en SVG puro (sin librería de charts): control total del estilo y
  cero peso extra en el bundle. El tramo histórico va sólido con relleno
  degradado; la asamblea en curso va punteada ("proyección"). La línea de
  umbral (gold, 51%) marca la mayoría legal de la Ley 675, así que un mes por
  debajo significa "no se alcanzó quórum" — información, no decoración.
*/

const VIEW_W = 680;
const VIEW_H = 248;
const PAD_L = 16;
const PAD_R = 16;
const PAD_T = 18;
const PAD_B = 28;
const QUORUM = 51;

const plotW = VIEW_W - PAD_L - PAD_R;
const plotH = VIEW_H - PAD_T - PAD_B;

type Pt = { x: number; y: number };

/** Catmull-Rom → Bézier cúbico: curva suave que pasa por cada punto. */
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x} ${pts[0].y}` : "";
  const t = 0.16; // tensión: menor = más ceñido a los datos
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) * t;
    const c1y = p1.y + (p2.y - p0.y) * t;
    const c2x = p2.x - (p3.x - p1.x) * t;
    const c2y = p2.y - (p3.y - p1.y) * t;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function ParticipationChart({ data }: { data: ParticipationPoint[] }) {
  const n = data.length;
  const x = (i: number) => PAD_L + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => PAD_T + (1 - v / 100) * plotH;
  const baseY = PAD_T + plotH;

  const pts: Pt[] = data.map((d, i) => ({ x: x(i), y: y(d.value) }));
  const projIndex = data.findIndex((d) => d.projected);
  const splitAt = projIndex === -1 ? n - 1 : projIndex - 1; // último punto cerrado

  const solidPts = pts.slice(0, splitAt + 1);
  const solidD = smoothPath(solidPts);
  const areaD = `${solidD} L ${solidPts[solidPts.length - 1].x} ${baseY} L ${solidPts[0].x} ${baseY} Z`;
  const dashD =
    projIndex === -1
      ? ""
      : `M ${pts[splitAt].x} ${pts[splitAt].y} L ${pts[projIndex].x} ${pts[projIndex].y}`;

  const lastClosed = data[splitAt];
  const prevClosed = data[splitAt - 1];
  const closed = data.filter((d) => !d.projected);
  const avg = Math.round(
    closed.reduce((s, d) => s + d.value, 0) / Math.max(closed.length, 1)
  );
  const delta =
    prevClosed != null ? lastClosed.value - prevClosed.value : 0;
  const projected = projIndex === -1 ? null : data[projIndex];

  const yThresh = y(QUORUM);

  return (
    <Card className="p-5">
      {/* Cabecera: título + filtro, al estilo de la tarjeta de analítica */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">
            Participación en asambleas
          </h2>
          <p className="mt-0.5 text-xs text-ink-faint">
            Poder que emitió voto en cada votación
          </p>
        </div>
        <span className="rounded-md border border-rule px-2.5 py-1 text-xs text-ink-soft">
          Últimas {closed.length}
        </span>
      </div>

      {/* KPIs + leyenda */}
      <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <p className="text-xs text-ink-faint">Promedio</p>
          <p className="font-display text-metric-val leading-none text-ink">
            {avg}%
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-ink-faint">Última cerrada</p>
            {delta !== 0 && (
              <span
                className={
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold " +
                  (delta > 0
                    ? "bg-ok-wash text-ok"
                    : "bg-due-wash text-due")
                }
              >
                {delta > 0 ? "+" : ""}
                {delta} pts
              </span>
            )}
          </div>
          <p className="font-display text-metric-val leading-none text-ink">
            {lastClosed.value}%
          </p>
        </div>

        <div className="ml-auto flex flex-col gap-1.5 text-xs text-ink-soft">
          <span className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "hsl(var(--vino))" }}
            />
            Participación
          </span>
          <span className="flex items-center gap-2">
            <span
              className="h-0 w-3 border-t-2 border-dashed"
              style={{ borderColor: "hsl(var(--gold))" }}
            />
            Umbral de quórum 51%
          </span>
        </div>
      </div>

      {/* Lienzo */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mt-4 h-auto w-full"
        role="img"
        aria-label={`Participación en asambleas: promedio ${avg} por ciento, última asamblea cerrada ${lastClosed.value} por ciento${
          projected ? `, proyección de la asamblea en curso ${projected.value} por ciento` : ""
        }. Umbral de quórum legal: 51 por ciento.`}
      >
        <defs>
          <linearGradient id="vinoArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "hsl(var(--vino))", stopOpacity: 0.32 }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--vino))", stopOpacity: 0.02 }} />
          </linearGradient>
        </defs>

        {/* Baseline */}
        <line
          x1={PAD_L}
          y1={baseY}
          x2={VIEW_W - PAD_R}
          y2={baseY}
          style={{ stroke: "hsl(var(--rule))" }}
          strokeWidth={1}
        />

        {/* Umbral de quórum (51%) */}
        <line
          x1={PAD_L}
          y1={yThresh}
          x2={VIEW_W - PAD_R}
          y2={yThresh}
          style={{ stroke: "hsl(var(--gold))" }}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          opacity={0.9}
        />
        <text
          x={VIEW_W - PAD_R}
          y={yThresh - 6}
          textAnchor="end"
          style={{ fill: "hsl(var(--gold))" }}
          className="font-mono text-[10px]"
        >
          quórum 51%
        </text>

        {/* Área histórica */}
        <path d={areaD} fill="url(#vinoArea)" />

        {/* Línea histórica (sólida) */}
        <path
          d={solidD}
          fill="none"
          style={{ stroke: "hsl(var(--vino))" }}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Proyección (punteada) */}
        {dashD && (
          <path
            d={dashD}
            fill="none"
            style={{ stroke: "hsl(var(--brass))" }}
            strokeWidth={2.5}
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
        )}

        {/* Nodo: última asamblea cerrada */}
        <circle
          cx={pts[splitAt].x}
          cy={pts[splitAt].y}
          r={3.5}
          style={{ fill: "hsl(var(--vino))" }}
        />

        {/* Nodo resaltado: proyección en curso */}
        {projected && (
          <>
            <circle
              cx={pts[projIndex].x}
              cy={pts[projIndex].y}
              r={7}
              style={{ fill: "hsl(var(--brass))" }}
              opacity={0.18}
            />
            <circle
              cx={pts[projIndex].x}
              cy={pts[projIndex].y}
              r={3.5}
              style={{ fill: "hsl(var(--surface))", stroke: "hsl(var(--brass))" }}
              strokeWidth={2}
            />
          </>
        )}

        {/* Etiquetas de mes */}
        {data.map((d, i) => (
          <text
            key={d.label}
            x={x(i)}
            y={VIEW_H - 8}
            textAnchor="middle"
            style={{ fill: d.projected ? "hsl(var(--brass))" : "hsl(var(--ink-faint))" }}
            className="font-mono text-[10px]"
          >
            {d.label}
          </text>
        ))}
      </svg>
    </Card>
  );
}
