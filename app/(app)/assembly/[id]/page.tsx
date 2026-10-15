import { MOCK_ASSEMBLY } from "@/lib/mock";
import { AssemblyClient } from "./assembly-client";

/**
 * `output: "export"` (GitHub Pages) no tiene servidor: cada ruta dinámica
 * debe pre-renderizarse para un conjunto conocido de ids en build time.
 * Hoy solo existe la asamblea de demostración; cuando haya más asambleas
 * reales, este arreglo debe incluir sus ids.
 */
export function generateStaticParams() {
  return [{ id: MOCK_ASSEMBLY.id }];
}

export default function AssemblyPage({
  params,
}: {
  params: { id: string };
}) {
  return <AssemblyClient id={params.id} />;
}
