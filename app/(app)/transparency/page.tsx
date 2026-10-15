"use client";

import { useMemo, useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { PageHeader } from "@/components/layout/page-header";
import { LedgerTable } from "@/components/transparency/ledger-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CONTRACTS, snowtrace, LEDGER_EVENT_LABEL } from "@/lib/constants";
import { shortAddress } from "@/lib/utils";
import type { LedgerEventType } from "@/types";

const FILTERS: { value: LedgerEventType | "all"; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "airdrop", label: LEDGER_EVENT_LABEL.airdrop },
  { value: "transfer", label: LEDGER_EVENT_LABEL.transfer },
  { value: "vote", label: LEDGER_EVENT_LABEL.vote },
];

export default function TransparencyPage() {
  const ledger = useGovernanceStore((s) => s.ledger);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<LedgerEventType | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ledger.filter((e) => {
      if (type !== "all" && e.type !== type) return false;
      if (!q) return true;
      return (
        e.unitId?.toLowerCase().includes(q) ||
        e.from.toLowerCase().includes(q) ||
        e.to?.toLowerCase().includes(q) ||
        e.txHash.toLowerCase().includes(q)
      );
    });
  }, [ledger, query, type]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <PageHeader
        title="Transparencia"
        description="El registro público de la copropiedad. Cada entrega de tokens, cada transferencia y cada voto queda en la cadena de bloques, a la vista de todos y sin posibilidad de alterarlo."
        actions={
          <a
            href={snowtrace.token(CONTRACTS.govToken)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-rule bg-surface px-3 py-2 text-sm font-semibold text-ink-soft hover:border-brass hover:text-ink"
          >
            Contrato del token
            <ExternalLink className="size-4" />
          </a>
        }
      />

      {/* Buscador y filtros */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por unidad, wallet o hash…"
            className="pl-9"
            aria-label="Buscar en el registro"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              aria-pressed={type === f.value}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded-sm"
            >
              <Badge variant={type === f.value ? "brass" : "neutral"}>{f.label}</Badge>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-faint">
        {filtered.length} {filtered.length === 1 ? "registro" : "registros"} · Token{" "}
        <span className="wallet-mono">{shortAddress(CONTRACTS.govToken)}</span>
      </p>

      <div className="mt-2">
        <LedgerTable events={filtered} />
      </div>
    </div>
  );
}
