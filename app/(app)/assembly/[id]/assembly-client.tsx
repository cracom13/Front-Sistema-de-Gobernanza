"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Radio, ListOrdered } from "lucide-react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { useJitsiAssembly } from "@/hooks/useJitsiAssembly";
import { JitsiRoom } from "@/components/assembly/jitsi-room";
import { QuorumMeter } from "@/components/assembly/quorum-meter";
import { AgendaPanel } from "@/components/assembly/agenda-panel";
import { VotePanel } from "@/components/proposals/vote-panel";
import { Card } from "@/components/ui/card";
import { MOCK_ASSEMBLY } from "@/lib/mock";
import type { AgendaItem } from "@/types";

/**
 * Contenido real de la página, como componente de cliente. `page.tsx` es un
 * componente de servidor que solo exporta `generateStaticParams` (requerido
 * para `output: "export"`) y delega aquí.
 */
export function AssemblyClient({ id }: { id: string }) {
  const { user } = useWeb3Auth();
  const { proposals, balance } = useGovernanceStore();

  // En producción se buscaría la asamblea por id; aquí se usa la de demostración.
  const assembly = useMemo(() => ({ ...MOCK_ASSEMBLY, id, roomName: id }), [id]);
  const { config, state, handleApiReady } = useJitsiAssembly(
    assembly,
    user ?? ({} as never)
  );

  const defaultItem =
    assembly.agenda.find((a) => a.state === "in_progress" && a.proposalId) ??
    assembly.agenda.find((a) => a.proposalId);
  const [activeItem, setActiveItem] = useState<AgendaItem | undefined>(defaultItem);

  const activeProposal = proposals.find((p) => p.id === activeItem?.proposalId);

  if (!user) return null;

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* ── Lado principal: videoconferencia ── */}
      <section className="flex min-h-[18rem] flex-1 flex-col lg:h-screen">
        <div className="flex items-center justify-between border-b border-rule bg-surface px-4 py-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="size-4" /> Salir
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-due-wash px-2.5 py-1 text-xs font-semibold text-due">
            <Radio className="size-3.5 animate-pulse" /> En vivo
          </span>
        </div>
        <div className="flex-1">
          <JitsiRoom config={config} onApiReady={handleApiReady} />
        </div>
      </section>

      {/* ── Panel lateral ── */}
      <aside className="flex w-full flex-col border-t border-rule bg-paper lg:h-screen lg:w-[25rem] lg:border-l lg:border-t-0">
        <header className="border-b border-rule px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brass">
            Asamblea en curso
          </p>
          <h1 className="mt-1 font-display text-xl font-semibold leading-tight text-ink">
            {assembly.title}
          </h1>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <QuorumMeter
            connectedPower={state.connectedPower}
            totalEligiblePower={assembly.totalEligiblePower}
            percent={state.quorumPercent}
          />

          <div>
            <div className="mb-2 flex items-center gap-2 text-ink-soft">
              <ListOrdered className="size-4 text-brass" />
              <h2 className="text-sm font-semibold">Orden del día</h2>
            </div>
            <AgendaPanel
              agenda={assembly.agenda}
              activeId={activeItem?.id}
              onSelect={setActiveItem}
            />
          </div>

          {/* Módulo de voto flotante: votar sin salir de la llamada */}
          {activeProposal && balance ? (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-ink-soft">
                Votación del punto actual
              </h2>
              <VotePanel proposal={activeProposal} balance={balance} />
            </div>
          ) : (
            <Card className="p-4 text-center text-sm text-ink-soft">
              Seleccione un punto del orden del día que incluya votación.
            </Card>
          )}
        </div>
      </aside>
    </div>
  );
}
