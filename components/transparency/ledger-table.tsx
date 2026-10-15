import { ArrowDownToLine, ArrowLeftRight, Vote, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  shortAddress,
  shortHash,
  formatNumber,
  formatDate,
} from "@/lib/utils";
import { snowtrace, VOTE_CHOICE_LABEL } from "@/lib/constants";
import type { LedgerEvent } from "@/types";

const TYPE_META = {
  airdrop: { label: "AirDrop", Icon: ArrowDownToLine, variant: "brass" as const },
  transfer: { label: "Transferencia", Icon: ArrowLeftRight, variant: "ink" as const },
  vote: { label: "Voto", Icon: Vote, variant: "ok" as const },
};

/**
 * Tabla inmutable de eventos on-chain. Cada fila enlaza a Snowtrace; nada en
 * esta tabla se puede editar: es el reflejo del registro público de la cadena.
 */
export function LedgerTable({ events }: { events: LedgerEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-rule py-14 text-center">
        <p className="font-display text-lg text-ink">Sin coincidencias</p>
        <p className="mt-1 text-sm text-ink-soft">
          No se encontraron eventos con ese criterio de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-surface">
      {/* Vista de tabla (desktop) */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-b border-rule bg-paper text-left text-xs text-ink-faint">
            <th className="px-4 py-3 font-semibold">Evento</th>
            <th className="px-4 py-3 font-semibold">Unidad</th>
            <th className="px-4 py-3 font-semibold">Wallet</th>
            <th className="px-4 py-3 text-right font-semibold">Monto / Voto</th>
            <th className="px-4 py-3 font-semibold">Fecha</th>
            <th className="px-4 py-3 font-semibold">Comprobante</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const meta = TYPE_META[e.type];
            return (
              <tr key={e.id} className="border-b border-rule last:border-0 hover:bg-paper/60">
                <td className="px-4 py-3">
                  <Badge variant={meta.variant}>
                    <meta.Icon className="size-3.5" />
                    {meta.label}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{e.unitId ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="wallet-mono text-ink-soft">
                    {shortAddress(e.to ?? e.from)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-tnum text-ink">
                  {e.type === "vote"
                    ? e.choice
                      ? VOTE_CHOICE_LABEL[e.choice]
                      : "—"
                    : `${formatNumber(e.amount ?? 0, 0)} COPR`}
                </td>
                <td className="px-4 py-3 text-ink-soft">{formatDate(e.timestamp)}</td>
                <td className="px-4 py-3">
                  <a
                    href={snowtrace.tx(e.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brass hover:underline wallet-mono"
                  >
                    {shortHash(e.txHash)}
                    <ExternalLink className="size-3" />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Vista de tarjetas (móvil) */}
      <ul className="divide-y divide-rule md:hidden">
        {events.map((e) => {
          const meta = TYPE_META[e.type];
          return (
            <li key={e.id} className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant={meta.variant}>
                  <meta.Icon className="size-3.5" />
                  {meta.label}
                </Badge>
                <span className="font-tnum text-sm font-semibold text-ink">
                  {e.type === "vote"
                    ? e.choice
                      ? VOTE_CHOICE_LABEL[e.choice]
                      : "—"
                    : `${formatNumber(e.amount ?? 0, 0)} COPR`}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
                <span className="font-medium text-ink">{e.unitId ?? "—"}</span>
                <span className="wallet-mono">{shortAddress(e.to ?? e.from)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-ink-faint">{formatDate(e.timestamp)}</span>
                <a
                  href={snowtrace.tx(e.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brass hover:underline wallet-mono"
                >
                  {shortHash(e.txHash)}
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
