import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Countdown } from "./countdown";
import { StatusBadge, CategoryBadge } from "./proposal-meta";
import { formatNumber, quorumProgress } from "@/lib/utils";
import type { Proposal } from "@/types";

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const progress = quorumProgress(proposal.tally.totalCast, proposal.quorumRequired);
  const quorumMet = proposal.tally.totalCast >= proposal.quorumRequired;

  return (
    <Link
      href={`/proposals/${proposal.id}`}
      className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
    >
      <Card className="group h-full p-5 transition-colors hover:border-brass/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={proposal.status} />
            <CategoryBadge category={proposal.category} />
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-ink-faint transition-colors group-hover:text-brass" />
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
          {proposal.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {proposal.description}
        </p>

        {proposal.status !== "pending" && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-soft">
                Quórum{" "}
                <span className={quorumMet ? "font-semibold text-ok" : "text-ink-faint"}>
                  {quorumMet ? "alcanzado" : `${progress.toFixed(0)}%`}
                </span>
              </span>
              <span className="font-tnum text-ink-faint">
                {formatNumber(proposal.tally.totalCast, 0)} /{" "}
                {formatNumber(proposal.quorumRequired, 0)}
              </span>
            </div>
            <Progress
              value={progress}
              tone={quorumMet ? "ok" : "brass"}
            />
          </div>
        )}

        <div className="mt-4 border-t border-rule pt-3">
          {proposal.status === "active" ? (
            <Countdown to={proposal.endsAt} compact />
          ) : proposal.status === "pending" ? (
            <span className="text-sm text-ink-faint">Abre pronto para votación</span>
          ) : (
            <span className="text-sm text-ink-faint">Resultado en firme</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
