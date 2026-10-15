"use client";

import Link from "next/link";
import {
  CalendarClock,
  Users,
  Vote,
  ArrowUpRight,
} from "lucide-react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { useGovernanceStore } from "@/store/useGovernanceStore";
import { VotingWeight } from "@/components/dashboard/voting-weight";
import { WalletCard } from "@/components/wallet/wallet-card";
import { FinanceStatus } from "@/components/finance-status";
import { Card } from "@/components/ui/card";
import { MOCK_ASSEMBLY } from "@/lib/mock";
import { formatDate, formatNumber, quorumProgress } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useWeb3Auth();
  const { balance, proposals } = useGovernanceStore();

  if (!user || !balance) return null;

  const activeCount = proposals.filter((p) => p.status === "active").length;
  const assemblyQuorum = quorumProgress(
    MOCK_ASSEMBLY.connectedPower,
    MOCK_ASSEMBLY.totalEligiblePower * 0.51
  );
  const firstName = user.fullName.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <header className="mb-7">
        <p className="text-ink-soft">
          {formatDate(new Date().toISOString())}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
          Buenas, {firstName}.
        </h1>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Columna principal */}
        <div className="space-y-5">
          <VotingWeight balance={balance} paymentStatus={user.paymentStatus} />

          <div className="grid gap-4 sm:grid-cols-3">
            <QuickStat
              icon={<CalendarClock className="size-5 text-brass" />}
              label="Próxima asamblea"
              value={formatDate(MOCK_ASSEMBLY.scheduledAt).replace(" de 2026", "")}
              footer={MOCK_ASSEMBLY.title}
              href={`/assembly/${MOCK_ASSEMBLY.id}`}
            />
            <QuickStat
              icon={<Users className="size-5 text-brass" />}
              label="Quórum del conjunto"
              value={`${assemblyQuorum.toFixed(0)}%`}
              footer={`${formatNumber(MOCK_ASSEMBLY.connectedPower, 0)} de poder conectado`}
            />
            <QuickStat
              icon={<Vote className="size-5 text-brass" />}
              label="Propuestas activas"
              value={activeCount.toString()}
              footer="Pendientes de su voto"
              href="/proposals"
            />
          </div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-4">
          <WalletCard address={user.walletAddress} balance={balance} />
          <FinanceStatus
            status={user.paymentStatus}
            penalty={user.delinquencyPenalty}
          />
          <Card className="p-5">
            <h2 className="font-display text-base font-semibold text-ink">
              Su unidad
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Torre / Apartamento" v={`Torre ${user.unit.tower} · Apto ${user.unit.apartment}`} />
              <Row k="Coeficiente de copropiedad" v={`${user.unit.coefficient.toFixed(2)}%`} />
              <Row k="Documento" v={user.idDocument ?? "—"} />
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
  footer,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  footer: string;
  href?: string;
}) {
  const inner = (
    <Card className="h-full p-4 transition-colors hover:border-brass/50">
      <div className="flex items-center justify-between">
        {icon}
        {href && <ArrowUpRight className="size-4 text-ink-faint" />}
      </div>
      <p className="mt-3 text-xs text-ink-faint">{label}</p>
      <p className="font-display text-metric-val leading-tight text-ink">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-ink-soft">{footer}</p>
    </Card>
  );
  return href ? (
    <Link
      href={href}
      className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-soft">{k}</dt>
      <dd className="font-semibold text-ink text-right">{v}</dd>
    </div>
  );
}
