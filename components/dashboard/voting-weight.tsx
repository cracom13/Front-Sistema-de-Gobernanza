"use client";

import { Info } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { TokenBalance, PaymentStatus } from "@/types";

/**
 * Héroe del dashboard: la derivación transparente del poder de voto.
 * Lo irrepetible de este producto es que el voto NO es 1 persona = 1 voto,
 * sino un peso calculado. Esa fórmula es el protagonista, no un número con
 * degradado genérico.
 */
export function VotingWeight({
  balance,
  paymentStatus,
}: {
  balance: TokenBalance;
  paymentStatus: PaymentStatus;
}) {
  const { breakdown, symbol } = balance;
  const effective = useCountUp(breakdown.effective);
  const delinquent = paymentStatus === "delinquent";

  return (
    <section
      aria-label="Su poder de voto efectivo"
      className="paper-grain overflow-hidden rounded-lg border border-ink/15 bg-ink text-paper"
    >
      <div className="grid gap-px bg-paper/10 lg:grid-cols-[1.4fr_1fr]">
        {/* Resultado */}
        <div className="bg-ink p-6 sm:p-8">
          <p className="text-sm text-paper/70">Su poder de voto efectivo</p>
          <div className="mt-1 flex items-end gap-2">
            <span className="font-display text-6xl font-semibold leading-none text-brass-soft font-tnum sm:text-7xl">
              {formatNumber(effective, 0)}
            </span>
            <span className="mb-1.5 font-display text-xl text-paper/60">{symbol}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/70">
            Es el peso con el que cuentan sus votos en la asamblea. Se calcula
            así, de forma pública y verificable:
          </p>
        </div>

        {/* Derivación — línea de libro contable */}
        <div className="flex flex-col justify-center gap-px bg-ink/50 p-6 font-tnum sm:p-8">
          <LedgerLine
            label="Coeficiente de copropiedad"
            value={formatPercent(breakdown.coefficient, 2)}
          />
          <LedgerLine
            label={`Tokens recibidos (${symbol})`}
            value={formatNumber(breakdown.baseTokens, 0)}
            op="="
          />
          <LedgerLine
            label={
              delinquent
                ? `Penalización por mora (${formatPercent(breakdown.penaltyRate * 100, 0)})`
                : "Penalización por mora"
            }
            value={delinquent ? `− ${formatNumber(breakdown.penaltyTokens, 0)}` : "0"}
            op="−"
            tone={delinquent ? "due" : "muted"}
          />
          <div className="mt-2 flex items-center justify-between border-t border-paper/20 pt-3">
            <span className="text-sm font-semibold text-paper">Poder efectivo</span>
            <span className="font-display text-lg font-semibold text-brass-soft">
              {formatNumber(breakdown.effective, 0)}
            </span>
          </div>
        </div>
      </div>

      {delinquent && (
        <div className="flex items-start gap-2 border-t border-paper/15 bg-due/15 px-6 py-3 text-sm text-paper sm:px-8">
          <Info className="mt-0.5 size-4 shrink-0 text-due" />
          <p>
            Su unidad figura en mora, por lo que se aplica una penalización del{" "}
            {formatPercent(breakdown.penaltyRate * 100, 0)} al peso de sus tokens
            (Ley 675 de 2001). Al ponerse al día, recupera su poder de voto
            completo.
          </p>
        </div>
      )}
    </section>
  );
}

function LedgerLine({
  label,
  value,
  op,
  tone = "default",
}: {
  label: string;
  value: string;
  op?: string;
  tone?: "default" | "due" | "muted";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="flex items-baseline gap-2 text-sm text-paper/70">
        {op && <span className="w-3 text-paper/40">{op}</span>}
        {label}
      </span>
      <span
        className={
          tone === "due"
            ? "font-semibold text-due"
            : tone === "muted"
              ? "text-paper/50"
              : "font-semibold text-paper"
        }
      >
        {value}
      </span>
    </div>
  );
}
