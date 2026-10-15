"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/layout/page-header";
import { ProposalCard } from "@/components/proposals/proposal-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ProposalStatus } from "@/types";

const FILTERS: { value: ProposalStatus | "all"; label: string }[] = [
  { value: "active", label: "Activas" },
  { value: "pending", label: "Pendientes" },
  { value: "closed", label: "Cerradas" },
  { value: "all", label: "Todas" },
];

export default function ProposalsPage() {
  const proposals = useGovernanceStore((s) => s.proposals);
  const [filter, setFilter] = useState<ProposalStatus | "all">("active");

  const counts = useMemo(
    () => ({
      active: proposals.filter((p) => p.status === "active").length,
      pending: proposals.filter((p) => p.status === "pending").length,
      closed: proposals.filter((p) => p.status === "closed").length,
      all: proposals.length,
    }),
    [proposals]
  );

  const visible = proposals.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <PageHeader
        title="Propuestas de la copropiedad"
        description="Cada propuesta usa la captura de saldos (snapshot) del inicio, de modo que su voto pesa lo que tenía registrado ese día: nadie puede mover tokens a última hora."
      />

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as ProposalStatus | "all")}
        className="mt-6"
      >
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
              <span className="rounded-sm bg-ink/8 px-1.5 text-xs font-semibold text-ink-soft">
                {counts[f.value]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={filter}>
          {visible.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {visible.map((p) => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-rule py-16 text-center">
              <Inbox className="size-8 text-ink-faint" />
              <p className="font-display text-lg text-ink">
                No hay propuestas en esta sección
              </p>
              <p className="max-w-xs text-sm text-ink-soft">
                Cuando la administración abra nuevas propuestas, aparecerán aquí
                para su voto.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
