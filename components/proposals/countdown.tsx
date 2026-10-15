"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { countdownTo, cn } from "@/lib/utils";

/** Cuenta regresiva al cierre de una propuesta, actualizada cada segundo. */
export function Countdown({
  to,
  className,
  compact = false,
}: {
  to: string;
  className?: string;
  compact?: boolean;
}) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const { expired, days, hours, minutes, seconds } = countdownTo(to);

  if (expired) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm text-ink-faint", className)}>
        <Clock className="size-4" /> Votación cerrada
      </span>
    );
  }

  if (compact) {
    const lead = days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft", className)}>
        <Clock className="size-4 text-brass" /> Cierra en {lead}
      </span>
    );
  }

  const units = [
    { v: days, l: "días" },
    { v: hours, l: "horas" },
    { v: minutes, l: "min" },
    { v: seconds, l: "seg" },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {units.map((u, i) => (
        <div key={u.l} className="flex items-center gap-2">
          <div className="min-w-14 rounded border border-rule bg-paper px-2.5 py-1.5 text-center">
            <span className="block font-display text-xl font-semibold text-ink font-tnum tabular-nums">
              {String(u.v).padStart(2, "0")}
            </span>
            <span className="block text-[10px] uppercase tracking-wide text-ink-faint">
              {u.l}
            </span>
          </div>
          {i < units.length - 1 && <span className="text-ink-faint">:</span>}
        </div>
      ))}
    </div>
  );
}
