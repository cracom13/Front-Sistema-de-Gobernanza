"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { shortAddress, formatNumber } from "@/lib/utils";
import { snowtrace } from "@/lib/constants";
import type { TokenBalance } from "@/types";

export function WalletCard({
  address,
  balance,
}: {
  address: string;
  balance: TokenBalance;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-ink-soft">
        <Wallet className="size-4 text-brass" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
          Mi billetera Web3
        </h2>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <code className="wallet-mono rounded bg-paper px-2.5 py-1.5 text-sm text-ink">
          {shortAddress(address, 10, 6)}
        </code>
        <button
          onClick={copy}
          aria-label="Copiar dirección"
          className="rounded p-1.5 text-ink-soft hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
        </button>
        <a
          href={snowtrace.address(address)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver en Snowtrace"
          className="rounded p-1.5 text-ink-soft hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          <ExternalLink className="size-4" />
        </a>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-rule pt-4 font-tnum">
        <div>
          <dt className="text-xs text-ink-faint">Saldo del token</dt>
          <dd className="mt-0.5 font-display text-metric-val text-ink">
            {formatNumber(Number(balance.formatted), 0)}
            <span className="ml-1 text-sm font-normal text-ink-soft">
              {balance.symbol}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-ink-faint">Poder efectivo</dt>
          <dd className="mt-0.5 font-display text-metric-val text-brass">
            {formatNumber(Number(balance.effectiveVotingPower), 0)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
