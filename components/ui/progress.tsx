"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valor 0–100. */
  value: number;
  /** Marca de umbral opcional (ej. quórum requerido) en 0–100. */
  threshold?: number;
  tone?: "ink" | "brass" | "ok" | "due";
}

const TONE: Record<NonNullable<ProgressProps["tone"]>, string> = {
  ink: "bg-ink",
  brass: "bg-brass",
  ok: "bg-ok",
  due: "bg-due",
};

/** Barra de progreso con marca de umbral (para quórum). */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, threshold, tone = "brass", ...props }, ref) => {
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "relative h-2.5 w-full overflow-hidden rounded-full bg-ink/10",
          className
        )}
        {...props}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", TONE[tone])}
          style={{ width: `${clamped}%` }}
        />
        {typeof threshold === "number" && (
          <span
            aria-hidden
            className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-ink"
            style={{ left: `${Math.max(0, Math.min(100, threshold))}%` }}
            title={`Quórum requerido: ${threshold.toFixed(0)}%`}
          />
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
