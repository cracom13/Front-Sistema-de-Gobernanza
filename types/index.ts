/**
 * Modelo de dominio — Gobernanza y Votación Descentralizada Residencial
 * Avalanche Fuji Testnet (Chain ID 43113)
 *
 * Reglas de negocio clave (Ley 675 de 2001, Sentencia T-633 de 2003):
 *  - El poder de voto se pondera por el coeficiente de copropiedad.
 *  - El estado de morosidad aplica una penalización al peso de los tokens.
 *  - Los saldos se congelan por snapshot al inicio de cada propuesta.
 */

// ─── Identidad y unidad residencial ─────────────────────────────────────────

export type UserRole = "resident" | "admin" | "council"; // residente | administrador | consejo

export type PaymentStatus = "current" | "delinquent"; // Al Día | En Mora

/** Unidad de copropiedad (Torre / Apartamento). */
export interface ResidentialUnit {
  id: string; // identificador interno (ej. "T2-301")
  tower: string; // Torre, ej. "2"
  apartment: string; // Apartamento, ej. "301"
  /** Coeficiente de copropiedad (0–100, suma 100 en todo el conjunto). */
  coefficient: number;
  /** Área privada en m² (informativa). */
  areaM2?: number;
}

export interface User {
  /** Identificador de sesión Web3Auth (sub). */
  id: string;
  fullName: string;
  email: string;
  /** Wallet embebida generada por Web3Auth (0x…). */
  walletAddress: string;
  /** Cédula / documento (KYC básico). Se almacena cifrado fuera de cadena. */
  idDocument?: string;
  role: UserRole;
  unit: ResidentialUnit;
  paymentStatus: PaymentStatus;
  /** Penalización aplicada al peso del token cuando está en mora (0–1). */
  delinquencyPenalty: number;
  /** Perfil completado en onboarding. */
  onboardingComplete: boolean;
  createdAt: string; // ISO 8601
}

// ─── Token de gobernanza y poder de voto ────────────────────────────────────

export interface TokenBalance {
  /** Dirección propietaria del saldo. */
  owner: string;
  /** Saldo bruto de tokens ERC-20 (string para evitar pérdida de precisión). */
  raw: string;
  /** Saldo formateado a unidades legibles según decimals. */
  formatted: string;
  decimals: number;
  symbol: string;
  /**
   * Poder de voto efectivo = f(coeficiente, saldo, penalización por mora).
   * Se expresa en las mismas unidades que `formatted`.
   */
  effectiveVotingPower: string;
  /** Desglose auditable del cálculo del poder de voto. */
  breakdown: VotingPowerBreakdown;
}

export interface VotingPowerBreakdown {
  coefficient: number; // coeficiente de copropiedad %
  baseTokens: number; // tokens antes de penalización
  penaltyRate: number; // 0–1
  penaltyTokens: number; // tokens descontados por mora
  effective: number; // resultado final
}

// ─── Propuestas y votación ──────────────────────────────────────────────────

export type ProposalStatus = "pending" | "active" | "closed"; // Pendiente | Activa | Cerrada

export type ProposalCategory = "budget" | "coexistence" | "works"; // Presupuesto | Convivencia | Obras

export type VoteChoice = "for" | "against" | "abstain"; // A Favor | En Contra | Abstención

export interface ProposalTally {
  for: number;
  against: number;
  abstain: number;
  /** Total de poder de voto emitido (for + against + abstain). */
  totalCast: number;
}

export interface Proposal {
  /** Id on-chain (uint256 como string) o slug legible. */
  id: string;
  title: string;
  description: string;
  category: ProposalCategory;
  status: ProposalStatus;
  /** Bloque / timestamp del snapshot de saldos. */
  snapshotBlock: number;
  snapshotAt: string; // ISO 8601
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601
  /** Quórum requerido en poder de voto (unidades del token). */
  quorumRequired: number;
  /** Poder de voto total elegible a la fecha del snapshot. */
  totalEligiblePower: number;
  tally: ProposalTally;
  /** Autor (dirección del proponente). */
  proposer: string;
  /** Hash de la transacción de creación en Snowtrace. */
  txHash?: string;
}

export interface Vote {
  id: string;
  proposalId: string;
  voter: string; // wallet
  unitId: string; // unidad que emitió el voto
  choice: VoteChoice;
  /** Peso del voto consumido (poder de voto efectivo en el snapshot). */
  weight: number;
  castAt: string; // ISO 8601
  txHash: string; // enlace a Snowtrace
  blockNumber: number;
}

// ─── Transparencia / Shameboard ─────────────────────────────────────────────

export type LedgerEventType = "airdrop" | "transfer" | "vote";

export interface LedgerEvent {
  id: string;
  type: LedgerEventType;
  /** Unidad asociada (si se conoce). */
  unitId?: string;
  from: string;
  to?: string;
  amount?: number; // para airdrop / transfer
  proposalId?: string; // para vote
  choice?: VoteChoice; // para vote
  txHash: string;
  blockNumber: number;
  timestamp: string; // ISO 8601
}

// ─── Asamblea en vivo (Jitsi Meet) ──────────────────────────────────────────

export interface AgendaItem {
  id: string;
  order: number;
  title: string;
  /** Propuesta vinculada que se vota durante este punto del orden del día. */
  proposalId?: string;
  state: "upcoming" | "in_progress" | "done";
}

export interface Assembly {
  id: string;
  title: string;
  scheduledAt: string; // ISO 8601
  /** roomName que se pasa a Jitsi (usa el id de la asamblea). */
  roomName: string;
  agenda: AgendaItem[];
  /** Quórum en vivo: poder de voto conectado vs. total elegible. */
  connectedPower: number;
  totalEligiblePower: number;
  status: ProposalStatus;
}

export interface JitsiConfig {
  /** Dominio de Jitsi (ej. "meet.jit.si"). */
  domain: string;
  /** Nombre de sala; se inicializa con el id de la asamblea. */
  roomName: string;
  /** Nombre visible, ej. "Carlos Pérez - Torre 2 Apto 301". */
  displayName: string;
  /** Correo del participante (opcional, para gravatar/registro). */
  email?: string;
  /** Config que deshabilita opciones no deseadas para residentes. */
  configOverwrite: {
    startWithAudioMuted: boolean;
    startWithVideoMuted: boolean;
    disableProfile: boolean; // impide cambiar nombre
    prejoinPageEnabled: boolean;
    readOnlyName: boolean;
    disableRemoteMute: boolean;
    remoteVideoMenu: { disableKick: boolean; disableGrantModerator: boolean };
  };
  interfaceConfigOverwrite: {
    TOOLBAR_BUTTONS: string[];
    SHOW_JITSI_WATERMARK: boolean;
    DISABLE_PRESENCE_STATUS: boolean;
  };
}

// ─── Asistente IA ────────────────────────────────────────────────────────────

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: string; // ISO 8601
}

// ─── Estado de transacción on-chain (UI) ────────────────────────────────────

export type TxState = "idle" | "signing" | "pending" | "confirmed" | "error";
