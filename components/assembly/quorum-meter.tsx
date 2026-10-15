import { Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatNumber, formatPercent } from "@/lib/utils";

/** Contador de quórum en vivo: % del poder de voto total conectado a la sala. */
export function QuorumMeter({
  connectedPower,
  totalEligiblePower,
  percent,
  requiredPercent = 51,
}: {
  connectedPower: number;
  totalEligiblePower: number;
  percent: number;
  requiredPercent?: number;
}) {
  const met = percent >= requiredPercent;
  return (
    <div className="rounded-lg border border-rule bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-ink-soft">
          <Users className="size-4 text-brass" />
          <span className="text-sm font-semibold">Quórum en vivo</span>
        </div>
        <span
          className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
            met ? "bg-ok-wash text-ok" : "bg-brass-wash text-brass"
          }`}
        >
          {met ? "Quórum alcanzado" : "Reuniendo quórum"}
        </span>
      </div>

      <p className="mt-3 font-display text-3xl font-semibold text-ink font-tnum">
        {formatPercent(percent, 0)}
      </p>
      <p className="text-xs text-ink-soft">
        {formatNumber(connectedPower, 0)} de {formatNumber(totalEligiblePower, 0)}{" "}
        en poder de voto conectado
      </p>

      <div className="mt-3">
        <Progress value={percent} threshold={requiredPercent} tone={met ? "ok" : "brass"} />
        <p className="mt-1.5 text-[11px] text-ink-faint">
          La marca indica el {requiredPercent}% exigido para deliberar.
        </p>
      </div>
    </div>
  );
}
