import { Check, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgendaItem } from "@/types";

/**
 * Orden del día interactivo. Aquí los marcadores numerados SÍ corresponden a
 * una secuencia real (los puntos de la asamblea), por eso se numeran.
 */
export function AgendaPanel({
  agenda,
  activeId,
  onSelect,
}: {
  agenda: AgendaItem[];
  activeId?: string;
  onSelect?: (item: AgendaItem) => void;
}) {
  return (
    <ol className="space-y-1">
      {agenda.map((item) => {
        const done = item.state === "done";
        const inProgress = item.state === "in_progress";
        const selected = activeId === item.id;
        const clickable = !!item.proposalId && !!onSelect;
        return (
          <li key={item.id}>
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onSelect?.(item)}
              className={cn(
                "flex w-full items-start gap-3 rounded px-2.5 py-2 text-left transition-colors",
                clickable && "hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass",
                selected && "bg-brass-wash",
                !clickable && "cursor-default"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold font-tnum",
                  done && "border-ok bg-ok text-surface",
                  inProgress && "border-brass bg-brass text-surface",
                  !done && !inProgress && "border-rule bg-paper text-ink-faint"
                )}
              >
                {done ? <Check className="size-3.5" /> : item.order}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-sm leading-snug",
                    inProgress ? "font-semibold text-ink" : "text-ink-soft"
                  )}
                >
                  {item.title}
                </span>
                {inProgress && (
                  <span className="mt-0.5 inline-flex items-center gap-0.5 text-xs font-semibold text-brass">
                    <Dot className="size-4 animate-pulse" /> En deliberación
                  </span>
                )}
                {item.proposalId && !inProgress && !done && (
                  <span className="text-xs text-ink-faint">Incluye votación</span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
