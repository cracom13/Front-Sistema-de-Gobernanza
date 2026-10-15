/**
 * Datos de demostración. Permiten renderizar todas las pantallas sin una
 * cadena en vivo ni contratos desplegados. En producción estos valores se
 * reemplazan por lecturas de `lib/contracts.ts`.
 */
import { computeVotingPower } from "./utils";
import type {
  Assembly,
  LedgerEvent,
  Proposal,
  TokenBalance,
  User,
} from "@/types";

export const MOCK_USER: User = {
  id: "web3auth|demo-001",
  fullName: "Carlos Pérez",
  email: "carlos.perez@correo.com",
  walletAddress: "0x8A3fC2b1e9D47aa0C5B2fE91c4D3aF7b6E201d9C",
  idDocument: "C.C. 79.xxx.xxx",
  role: "resident",
  unit: { id: "T2-301", tower: "2", apartment: "301", coefficient: 2.45, areaM2: 78 },
  paymentStatus: "delinquent",
  delinquencyPenalty: 0.15,
  onboardingComplete: true,
  createdAt: "2026-01-12T09:00:00Z",
};

export const MOCK_ADMIN: User = {
  ...MOCK_USER,
  id: "web3auth|admin-001",
  fullName: "Administración Conjunto Altos del Nogal",
  email: "admin@altosdelnogal.co",
  role: "admin",
  paymentStatus: "current",
  delinquencyPenalty: 0,
};

/** Balance y poder de voto efectivo del usuario de demo. */
export function mockBalance(user: User = MOCK_USER): TokenBalance {
  const baseTokens = 2450; // proporcional al coeficiente 2.45%
  const breakdown = computeVotingPower(
    baseTokens,
    user.unit.coefficient,
    user.paymentStatus === "delinquent" ? user.delinquencyPenalty : 0
  );
  return {
    owner: user.walletAddress,
    raw: `${baseTokens}000000000000000000`,
    formatted: baseTokens.toString(),
    decimals: 18,
    symbol: "COPR",
    effectiveVotingPower: breakdown.effective.toString(),
    breakdown,
  };
}

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "42",
    title: "Presupuesto 2027 y cuota ordinaria de administración",
    description:
      "Aprobación del presupuesto anual de gastos comunes para 2027, que fija la cuota ordinaria mensual en $410.000 por unidad base. Incluye reserva legal, servicios, vigilancia y mantenimiento de zonas comunes conforme al Art. 35 de la Ley 675.",
    category: "budget",
    status: "active",
    snapshotBlock: 38_210_004,
    snapshotAt: "2026-10-10T05:00:00Z",
    startsAt: "2026-10-10T14:00:00Z",
    endsAt: "2026-10-17T23:59:00Z",
    quorumRequired: 51_000,
    totalEligiblePower: 100_000,
    tally: { for: 28_400, against: 9_200, abstain: 3_100, totalCast: 40_700 },
    proposer: "0x8A3fC2b1e9D47aa0C5B2fE91c4D3aF7b6E201d9C",
    txHash: "0x9f2b1c7d4e8a0f6b3c5d2e1a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9",
  },
  {
    id: "43",
    title: "Reglamento de uso del salón comunal y zona BBQ",
    description:
      "Propuesta de actualización del reglamento de convivencia para el uso del salón comunal: horarios, depósito de garantía, aforo máximo y responsabilidades por daños. Busca reducir conflictos entre copropietarios.",
    category: "coexistence",
    status: "active",
    snapshotBlock: 38_215_880,
    snapshotAt: "2026-10-12T05:00:00Z",
    startsAt: "2026-10-12T14:00:00Z",
    endsAt: "2026-10-19T23:59:00Z",
    quorumRequired: 51_000,
    totalEligiblePower: 100_000,
    tally: { for: 15_900, against: 4_300, abstain: 2_000, totalCast: 22_200 },
    proposer: "0x1b4C9eF2a7D3056c8B0f1E2d3A4b5C6d7E8f9a0B",
  },
  {
    id: "44",
    title: "Obra: impermeabilización de cubiertas Torres 1 y 2",
    description:
      "Autorización para contratar la impermeabilización de las cubiertas de las Torres 1 y 2 por un valor de $86.000.000, con cargo al fondo de imprevistos. Incluye tres cotizaciones adjuntas y cronograma de ocho semanas.",
    category: "works",
    status: "pending",
    snapshotBlock: 0,
    snapshotAt: "2026-10-20T05:00:00Z",
    startsAt: "2026-10-20T14:00:00Z",
    endsAt: "2026-10-27T23:59:00Z",
    quorumRequired: 60_000,
    totalEligiblePower: 100_000,
    tally: { for: 0, against: 0, abstain: 0, totalCast: 0 },
    proposer: "0x1b4C9eF2a7D3056c8B0f1E2d3A4b5C6d7E8f9a0B",
  },
  {
    id: "40",
    title: "Instalación de medidores individuales de agua",
    description:
      "Aprobada en septiembre: instalación de medidores individuales por apartamento para facturación justa del consumo de agua. Ejecución prevista para el primer trimestre de 2027.",
    category: "works",
    status: "closed",
    snapshotBlock: 37_980_112,
    snapshotAt: "2026-09-01T05:00:00Z",
    startsAt: "2026-09-01T14:00:00Z",
    endsAt: "2026-09-08T23:59:00Z",
    quorumRequired: 51_000,
    totalEligiblePower: 100_000,
    tally: { for: 62_300, against: 8_100, abstain: 4_500, totalCast: 74_900 },
    proposer: "0x1b4C9eF2a7D3056c8B0f1E2d3A4b5C6d7E8f9a0B",
    txHash: "0x3a1f9e8d7c6b5a4039281746352819f0e1d2c3b4a5968778695a4b3c2d1e0f9a",
  },
];

export const MOCK_ASSEMBLY: Assembly = {
  id: "asamblea-ordinaria-2026",
  title: "Asamblea Ordinaria de Copropietarios 2026",
  scheduledAt: "2026-10-15T19:00:00Z",
  roomName: "asamblea-ordinaria-2026",
  connectedPower: 58_400,
  totalEligiblePower: 100_000,
  status: "active",
  agenda: [
    { id: "a1", order: 1, title: "Verificación del quórum y aprobación del orden del día", state: "done" },
    { id: "a2", order: 2, title: "Informe de gestión de la administración", state: "done" },
    { id: "a3", order: 3, title: "Presupuesto 2027 y cuota ordinaria", proposalId: "42", state: "in_progress" },
    { id: "a4", order: 4, title: "Reglamento del salón comunal", proposalId: "43", state: "upcoming" },
    { id: "a5", order: 5, title: "Obra: impermeabilización de cubiertas", proposalId: "44", state: "upcoming" },
    { id: "a6", order: 6, title: "Proposiciones y varios", state: "upcoming" },
  ],
};

export const MOCK_LEDGER: LedgerEvent[] = [
  {
    id: "l1",
    type: "airdrop",
    unitId: "T2-301",
    from: "0x0000000000000000000000000000000000000000",
    to: "0x8A3fC2b1e9D47aa0C5B2fE91c4D3aF7b6E201d9C",
    amount: 2450,
    txHash: "0xaa11bb22cc33dd44ee55ff66aa77bb88cc99dd00ee11ff22aa33bb44cc55dd66",
    blockNumber: 38_100_001,
    timestamp: "2026-01-12T10:00:00Z",
  },
  {
    id: "l2",
    type: "vote",
    unitId: "T1-1203",
    from: "0x1b4C9eF2a7D3056c8B0f1E2d3A4b5C6d7E8f9a0B",
    proposalId: "40",
    choice: "for",
    txHash: "0xbb22cc33dd44ee55ff66aa77bb88cc99dd00ee11ff22aa33bb44cc55dd66ee77",
    blockNumber: 37_980_540,
    timestamp: "2026-09-02T16:20:00Z",
  },
  {
    id: "l3",
    type: "transfer",
    unitId: "T3-502",
    from: "0x5d7E8f9a0B1b4C9eF2a7D3056c8B0f1E2d3A4b5C",
    to: "0x9a0B1b4C9eF2a7D3056c8B0f1E2d3A4b5C6d7E8f",
    amount: 120,
    txHash: "0xcc33dd44ee55ff66aa77bb88cc99dd00ee11ff22aa33bb44cc55dd66ee77ff88",
    blockNumber: 38_050_990,
    timestamp: "2026-09-18T11:05:00Z",
  },
  {
    id: "l4",
    type: "vote",
    unitId: "T2-301",
    from: "0x8A3fC2b1e9D47aa0C5B2fE91c4D3aF7b6E201d9C",
    proposalId: "42",
    choice: "for",
    txHash: "0xdd44ee55ff66aa77bb88cc99dd00ee11ff22aa33bb44cc55dd66ee77ff8800aa",
    blockNumber: 38_211_455,
    timestamp: "2026-10-11T09:45:00Z",
  },
];
