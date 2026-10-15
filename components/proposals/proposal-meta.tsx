import { Wallet, Users, HardHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  PROPOSAL_STATUS_LABEL,
  PROPOSAL_CATEGORY_LABEL,
} from "@/lib/constants";
import type { ProposalCategory, ProposalStatus } from "@/types";

const STATUS_VARIANT = {
  active: "ok",
  pending: "brass",
  closed: "neutral",
} as const;

export function StatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {status === "active" && (
        <span className="size-1.5 rounded-full bg-ok animate-pulse" aria-hidden />
      )}
      {PROPOSAL_STATUS_LABEL[status]}
    </Badge>
  );
}

const CATEGORY_ICON = {
  budget: Wallet,
  coexistence: Users,
  works: HardHat,
} as const;

export function CategoryBadge({ category }: { category: ProposalCategory }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <Badge variant="ink">
      <Icon className="size-3.5" />
      {PROPOSAL_CATEGORY_LABEL[category]}
    </Badge>
  );
}
