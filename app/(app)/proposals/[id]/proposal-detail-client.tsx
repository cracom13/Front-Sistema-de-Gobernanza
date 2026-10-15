"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Camera,
  Target,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Countdown } from "@/components/proposals/countdown";
import { ResultsBar } from "@/components/proposals/results-bar";
import { VotePanel } from "@/components/proposals/vote-panel";
import { StatusBadge, CategoryBadge } from "@/components/proposals/proposal-meta";
import {
  formatDate,
  formatNumber,
  quorumProgress,
  shortHash,
} from "@/lib/utils";
import { snowtrace } from "@/lib/constants";

/**
 * Contenido real de la página, como componente de cliente. `page.tsx` es un
 * componente de servidor que solo exporta `generateStaticParams` (requerido
 * para `output: "export"`) y delega aquí.
 */
export function ProposalDetailClient({ id }: { id: string }) {
  const { proposals, balance } = useGovernanceStore();
  const { user } = useWeb3Auth();

  const proposal = proposals.find((p) => p.id === id);
  if (!proposals.length) return null; // aún hidratando
  if (!proposal) return notFound();

  const progress = quorumProgress(proposal.tally.totalCast, proposal.quorumRequired);
  const quorumMet = proposal.tally.totalCast >= proposal.quorumRequired;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <Link
        href="/proposals"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Todas las propuestas
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* ── Detalle ── */}
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={proposal.status} />
            <CategoryBadge category={proposal.category} />
            <span className="text-sm text-ink-faint">Propuesta #{proposal.id}</span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">
            {proposal.title}
          </h1>

          {proposal.status === "active" && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-ink-soft">
                Tiempo restante para votar
              </p>
              <Countdown to={proposal.endsAt} />
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-rule pt-6 text-[17px] leading-relaxed text-ink">
            <p>{proposal.description}</p>
          </div>

          {/* Ficha técnica */}
          <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-3">
            <Fact
              icon={<Target className="size-4 text-brass" />}
              label="Quórum requerido"
              value={`${formatNumber(proposal.quorumRequired, 0)} ${balance?.symbol ?? ""}`}
            />
            <Fact
              icon={<CalendarClock className="size-4 text-brass" />}
              label="Cierre de votación"
              value={formatDate(proposal.endsAt, true)}
            />
            <Fact
              icon={<Camera className="size-4 text-brass" />}
              label="Snapshot de saldos"
              value={
                proposal.snapshotBlock
                  ? `Bloque ${formatNumber(proposal.snapshotBlock, 0)}`
                  : "Al abrir la propuesta"
              }
            />
          </dl>

          {/* Resultados en tiempo real */}
          {proposal.status !== "pending" && (
            <Card className="mt-6 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Resultados en vivo
                </h2>
                <span className="text-xs text-ink-faint">
                  Lectura directa del contrato
                </span>
              </div>

              <div className="mt-4">
                <ResultsBar tally={proposal.tally} />
              </div>

              <div className="mt-5 space-y-1.5 border-t border-rule pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-ink-soft">
                    {quorumMet && <CheckCircle2 className="size-4 text-ok" />}
                    Avance del quórum
                  </span>
                  <span className="font-tnum font-semibold text-ink">
                    {formatNumber(proposal.tally.totalCast, 0)} /{" "}
                    {formatNumber(proposal.quorumRequired, 0)}
                  </span>
                </div>
                <Progress value={progress} threshold={100} tone={quorumMet ? "ok" : "brass"} />
                <p className="text-xs text-ink-faint">
                  {quorumMet
                    ? "El quórum exigido por la Ley 675 ya se cumplió."
                    : `Falta ${formatNumber(
                        Math.max(0, proposal.quorumRequired - proposal.tally.totalCast),
                        0
                      )} de poder de voto para alcanzar el quórum.`}
                </p>
              </div>

              {proposal.txHash && (
                <a
                  href={snowtrace.tx(proposal.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brass hover:underline"
                >
                  Transacción {shortHash(proposal.txHash)}
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </Card>
          )}
        </article>

        {/* ── Panel de voto (sticky) ── */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          {proposal.status === "active" && balance && user ? (
            <VotePanel proposal={proposal} balance={balance} />
          ) : (
            <Card className="p-6 text-center">
              <p className="font-display text-lg font-semibold text-ink">
                {proposal.status === "pending"
                  ? "Votación aún no abierta"
                  : "Votación cerrada"}
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                {proposal.status === "pending"
                  ? `La votación abre el ${formatDate(proposal.startsAt)}.`
                  : "Esta propuesta ya no admite votos. El resultado es definitivo."}
              </p>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface p-4">
      <dt className="flex items-center gap-1.5 text-xs text-ink-faint">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
