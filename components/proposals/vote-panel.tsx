"use client";

import { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  PenLine,
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { castVote } from "@/lib/contracts";
import { CONTRACTS, snowtrace, VOTE_CHOICE_LABEL } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";
import type { Proposal, TokenBalance, TxState, VoteChoice } from "@/types";

const OPTIONS: { value: VoteChoice; icon: typeof ThumbsUp; cls: string }[] = [
  { value: "for", icon: ThumbsUp, cls: "data-[active=true]:border-ok data-[active=true]:bg-ok-wash data-[active=true]:text-ok" },
  { value: "against", icon: ThumbsDown, cls: "data-[active=true]:border-due data-[active=true]:bg-due-wash data-[active=true]:text-due" },
  { value: "abstain", icon: MinusCircle, cls: "data-[active=true]:border-ink data-[active=true]:bg-ink/5 data-[active=true]:text-ink" },
];

export function VotePanel({
  proposal,
  balance,
}: {
  proposal: Proposal;
  balance: TokenBalance;
}) {
  const { user, getSigner, isDemo } = useWeb3Auth();
  const applyVote = useGovernanceStore((s) => s.applyVote);

  const [choice, setChoice] = useState<VoteChoice | null>(null);
  const [tx, setTx] = useState<TxState>("idle");
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const weight = Number(balance.effectiveVotingPower);
  const governorReady =
    CONTRACTS.governor !== "0x0000000000000000000000000000000000000000";

  async function submit() {
    if (!choice || !user) return;
    setError(null);
    setTx("signing");
    try {
      let txHash: string;
      let blockNumber: number;

      if (isDemo || !governorReady) {
        // Simulación de firma + confirmación en modo demostración.
        await new Promise((r) => setTimeout(r, 1200));
        setTx("pending");
        await new Promise((r) => setTimeout(r, 1400));
        txHash = `0x${crypto.randomUUID().replace(/-/g, "")}${crypto
          .randomUUID()
          .replace(/-/g, "")}`.slice(0, 66);
        blockNumber = 38_220_000 + Math.floor(Math.random() * 999);
      } else {
        const signer = await getSigner();
        if (!signer) throw new Error("No se pudo obtener la billetera.");
        setTx("pending");
        const res = await castVote(signer, proposal.id, choice);
        txHash = res.hash;
        blockNumber = res.blockNumber;
      }

      applyVote(proposal.id, choice, weight, {
        id: crypto.randomUUID(),
        type: "vote",
        unitId: user.unit.id,
        from: user.walletAddress,
        proposalId: proposal.id,
        choice,
        txHash,
        blockNumber,
        timestamp: new Date().toISOString(),
      });
      setHash(txHash);
      setTx("confirmed");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "La transacción no pudo completarse."
      );
      setTx("error");
    }
  }

  // ── Estado: voto confirmado ──
  if (tx === "confirmed" && hash) {
    return (
      <Card className="overflow-hidden border-ok/40">
        <div className="flex flex-col items-center gap-3 bg-ok-wash px-6 py-8 text-center">
          <CheckCircle2 className="size-12 text-ok animate-seal-in" />
          <div>
            <p className="font-display text-xl font-semibold text-ink">
              Voto registrado en cadena
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Votó <strong>{VOTE_CHOICE_LABEL[choice!]}</strong> con un peso de{" "}
              {formatNumber(weight, 0)} {balance.symbol}.
            </p>
          </div>
          <a
            href={snowtrace.tx(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brass hover:underline"
          >
            Ver comprobante en Snowtrace
            <ExternalLink className="size-4" />
          </a>
        </div>
      </Card>
    );
  }

  const busy = tx === "signing" || tx === "pending";

  return (
    <Card className="p-5">
      <h2 className="font-display text-lg font-semibold text-ink">Emita su voto</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Su decisión se firma desde su billetera y se escribe en la cadena. No se
        puede modificar una vez confirmada.
      </p>

      {/* Peso del voto */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-brass/30 bg-brass-wash px-4 py-3">
        <span className="text-sm text-ink-soft">Peso de su voto</span>
        <span className="font-display text-xl font-semibold text-brass font-tnum">
          {formatNumber(weight, 0)} {balance.symbol}
        </span>
      </div>

      {/* Opciones */}
      <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Opción de voto">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          const active = choice === o.value;
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={active}
              disabled={busy}
              data-active={active}
              onClick={() => setChoice(o.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border border-rule bg-surface px-2 py-4 text-sm font-semibold text-ink-soft transition-colors hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:opacity-60",
                o.cls
              )}
            >
              <Icon className="size-6" />
              {VOTE_CHOICE_LABEL[o.value]}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-due/30 bg-due-wash px-3 py-2.5 text-sm text-due">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Button
        variant="brass"
        size="lg"
        className="mt-5 w-full"
        disabled={!choice || busy}
        onClick={submit}
      >
        {tx === "signing" ? (
          <>
            <Loader2 className="size-5 animate-spin" /> Firme en su billetera…
          </>
        ) : tx === "pending" ? (
          <>
            <Loader2 className="size-5 animate-spin" /> Confirmando en la red…
          </>
        ) : (
          <>
            <PenLine className="size-5" /> Firmar y emitir voto on-chain
          </>
        )}
      </Button>

      {isDemo && (
        <p className="mt-3 text-center text-xs text-ink-faint">
          Modo demostración: la firma se simula sin gastar AVAX real.
        </p>
      )}
    </Card>
  );
}
