import { type ReactNode } from "react";

/** Encabezado de página consistente: título Space Grotesk + contexto + acciones. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-rule pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-ink-soft leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
