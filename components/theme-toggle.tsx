"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * Toggle entre modo claro y oscuro. El icono muestra el estado al que se
 * cambiará al pulsar (sol = pasar a claro, luna = pasar a oscuro), como un
 * interruptor físico.
 */
export function ThemeToggle({
  className,
  labeled = false,
}: {
  className?: string;
  labeled?: boolean;
}) {
  const { theme, toggle, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        "inline-flex items-center gap-2.5 rounded text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass",
        labeled ? "w-full px-3 py-2.5 text-sm font-semibold" : "p-2",
        className
      )}
    >
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <Sun
          className={cn(
            "absolute size-5 transition-[transform,opacity] duration-150 ease-[var(--ease-out)]",
            mounted && isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <Moon
          className={cn(
            "absolute size-5 transition-[transform,opacity] duration-150 ease-[var(--ease-out)]",
            mounted && isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        />
      </span>
      {labeled && <span>{isDark ? "Modo oscuro" : "Modo claro"}</span>}
    </button>
  );
}
