"use client";

import { useState } from "react";
import { Send, CheckCircle2, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { shortAddress, formatNumber } from "@/lib/utils";
import type { PaymentStatus } from "@/types";

interface Resident {
  id: string;
  name: string;
  wallet: string;
  unit: string;
  coefficient: number;
  tokens: number;
  status: PaymentStatus;
}

const SEED: Resident[] = [
  { id: "1", name: "Carlos Pérez", wallet: "0x8A3fC2b1e9D47aa0C5B2fE91c4D3aF7b6E201d9C", unit: "T2-301", coefficient: 2.45, tokens: 2450, status: "delinquent" },
  { id: "2", name: "María Restrepo", wallet: "0x1b4C9eF2a7D3056c8B0f1E2d3A4b5C6d7E8f9a0B", unit: "T1-1203", coefficient: 3.1, tokens: 3100, status: "current" },
  { id: "3", name: "Jorge Gómez", wallet: "0x5d7E8f9a0B1b4C9eF2a7D3056c8B0f1E2d3A4b5C", unit: "T3-502", coefficient: 1.98, tokens: 1980, status: "current" },
  { id: "4", name: "Ana Lucía Vera", wallet: "0x9a0B1b4C9eF2a7D3056c8B0f1E2d3A4b5C6d7E8f", unit: "T2-804", coefficient: 2.72, tokens: 2720, status: "current" },
];

export function ResidentManager() {
  const [residents, setResidents] = useState<Resident[]>(SEED);
  const [airdropAmount, setAirdropAmount] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function toggleStatus(id: string) {
    setResidents((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "current" ? "delinquent" : "current" }
          : r
      )
    );
  }

  function runAirdrop() {
    const amount = parseFloat(airdropAmount);
    if (!amount) return;
    // En producción: airdropTokens(signer, wallets, amountsWei)
    setNotice(
      `AirDrop preparado: ${formatNumber(amount, 0)} COPR por unidad a ${residents.length} propietarios (proporcional al coeficiente).`
    );
    setAirdropAmount("");
    setTimeout(() => setNotice(null), 5000);
  }

  return (
    <div className="space-y-5">
      {/* AirDrop masivo */}
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <Coins className="size-5 text-brass" />
          <h2 className="font-display text-lg font-semibold text-ink">
            Emitir AirDrop de tokens
          </h2>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          Entrega tokens de gobernanza a las billeteras de los propietarios,
          proporcional al coeficiente de cada unidad.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="airdrop">Tokens base por 1% de coeficiente</Label>
            <Input
              id="airdrop"
              inputMode="decimal"
              placeholder="1000"
              value={airdropAmount}
              onChange={(e) => setAirdropAmount(e.target.value)}
            />
          </div>
          <Button variant="brass" onClick={runAirdrop} disabled={!airdropAmount}>
            <Send className="size-4" /> Emitir a {residents.length} wallets
          </Button>
        </div>
        {notice && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-ok/30 bg-ok-wash px-3 py-2.5 text-sm text-ok">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            {notice}
          </div>
        )}
      </Card>

      {/* Tabla de residentes */}
      <Card className="overflow-hidden">
        <div className="border-b border-rule px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">Residentes</h2>
          <p className="text-sm text-ink-soft">
            Marque el estado de cuenta. La mora aplica una penalización automática
            al poder de voto.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-paper text-left text-xs text-ink-faint">
                <th className="px-5 py-3 font-semibold">Propietario</th>
                <th className="px-5 py-3 font-semibold">Unidad</th>
                <th className="px-5 py-3 text-right font-semibold">Coef.</th>
                <th className="px-5 py-3 text-right font-semibold">Tokens</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 text-center font-semibold">Al día</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((r) => (
                <tr key={r.id} className="border-b border-rule last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className="wallet-mono text-xs text-ink-faint">
                      {shortAddress(r.wallet)}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">{r.unit}</td>
                  <td className="px-5 py-3 text-right font-tnum text-ink-soft">
                    {r.coefficient.toFixed(2)}%
                  </td>
                  <td className="px-5 py-3 text-right font-tnum text-ink">
                    {formatNumber(r.tokens, 0)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={r.status === "current" ? "ok" : "due"}>
                      {r.status === "current" ? "Al día" : "En mora"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Switch
                      checked={r.status === "current"}
                      onCheckedChange={() => toggleStatus(r.id)}
                      aria-label={`Marcar ${r.name} como al día o en mora`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
