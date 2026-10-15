import { cn } from "@/lib/utils";

/**
 * Marca "El Acta Viva": un sello notarial que encierra la fachada de un
 * edificio. El sello = inmutabilidad on-chain; la fachada = la copropiedad.
 */
export function Logo({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Gobernanza Residencial"
      className={className}
    >
      {/* Sello */}
      <circle cx="24" cy="24" r="22" className="stroke-brass" strokeWidth="1.5" />
      <circle
        cx="24"
        cy="24"
        r="18.5"
        className="stroke-brass/50"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      {/* Fachada del edificio */}
      <rect x="15" y="14" width="18" height="22" className="fill-ink" rx="1" />
      {/* Ventanas (unidades) */}
      <g className="fill-brass">
        <rect x="18" y="18" width="3" height="3" rx="0.5" />
        <rect x="23" y="18" width="3" height="3" rx="0.5" />
        <rect x="28" y="18" width="3" height="3" rx="0.5" />
        <rect x="18" y="23" width="3" height="3" rx="0.5" />
        <rect x="28" y="23" width="3" height="3" rx="0.5" />
      </g>
      {/* Puerta */}
      <rect x="22" y="29" width="4" height="7" className="fill-paper" rx="0.5" />
      {/* Ventana central destacada = voto activo */}
      <rect x="23" y="23" width="3" height="3" rx="0.5" className="fill-paper" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo size={32} />
      <div className="leading-none">
        <span className="block font-display text-base font-semibold text-ink">
          Gobernanza
        </span>
        <span className="block font-sans text-[11px] font-medium tracking-wide text-brass">
          Altos del Nogal
        </span>
      </div>
    </div>
  );
}
