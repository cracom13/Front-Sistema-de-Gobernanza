import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import type { PaymentStatus } from "@/types";

/** Insignia financiera: Al Día (verde) vs. En Mora con penalización (rojo). */
export function FinanceStatus({
  status,
  penalty,
  className,
}: {
  status: PaymentStatus;
  penalty: number;
  className?: string;
}) {
  const current = status === "current";
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-4 py-3",
        current ? "border-ok/30 bg-ok-wash" : "border-due/30 bg-due-wash",
        className
      )}
    >
      {current ? (
        <CheckCircle2 className="size-5 shrink-0 text-ok" />
      ) : (
        <AlertTriangle className="size-5 shrink-0 text-due" />
      )}
      <div className="leading-tight">
        <p className={cn("text-sm font-semibold", current ? "text-ok" : "text-due")}>
          {current ? "Al día" : "En mora"}
        </p>
        <p className="text-xs text-ink-soft">
          {current
            ? "Su poder de voto está completo"
            : `Penalización del ${formatPercent(penalty * 100, 0)} sobre su voto`}
        </p>
      </div>
    </div>
  );
}
