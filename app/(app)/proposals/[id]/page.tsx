import { MOCK_PROPOSALS } from "@/lib/mock";
import { ProposalDetailClient } from "./proposal-detail-client";

/**
 * `output: "export"` (GitHub Pages) no tiene servidor: cada ruta dinámica
 * debe pre-renderizarse para un conjunto conocido de ids en build time.
 * Cuando haya contrato real desplegado, esto puede leer los ids on-chain
 * en build time en vez de los datos de demostración.
 */
export function generateStaticParams() {
  return MOCK_PROPOSALS.map((p) => ({ id: p.id }));
}

export default function ProposalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProposalDetailClient id={params.id} />;
}
