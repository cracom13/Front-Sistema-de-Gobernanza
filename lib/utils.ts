import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { VotingPowerBreakdown } from "@/types";

/** Combina clases Tailwind resolviendo conflictos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Recorta una dirección 0x para mostrarla: 0x1234…abcd */
export function shortAddress(address?: string, lead = 6, tail = 4): string {
  if (!address) return "—";
  if (address.length <= lead + tail) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

/** Recorta un hash de transacción. */
export function shortHash(hash?: string): string {
  return shortAddress(hash, 10, 8);
}

/**
 * Cálculo del poder de voto efectivo.
 *
 * Fórmula de ponderación (reglas de negocio):
 *   base      = tokens recibidos (proporcionales al coeficiente de copropiedad)
 *   penalidad = base × penaltyRate   (si está en mora)
 *   efectivo  = base − penalidad
 *
 * Es determinista y auditable; el mismo cálculo vive en el contrato on-chain.
 */
export function computeVotingPower(
  baseTokens: number,
  coefficient: number,
  penaltyRate: number
): VotingPowerBreakdown {
  const penalty = Math.max(0, Math.min(1, penaltyRate));
  const penaltyTokens = Math.round(baseTokens * penalty * 100) / 100;
  const effective = Math.round((baseTokens - penaltyTokens) * 100) / 100;
  return {
    coefficient,
    baseTokens,
    penaltyRate: penalty,
    penaltyTokens,
    effective,
  };
}

/** Formatea número con separador de miles es-CO. */
export function formatNumber(value: number, maxFractionDigits = 2): string {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

/** Formatea porcentaje con una cifra decimal. */
export function formatPercent(value: number, digits = 1): string {
  return `${new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

/** Porcentaje de quórum alcanzado (0–100, acotado). */
export function quorumProgress(cast: number, required: number): number {
  if (required <= 0) return 0;
  return Math.min(100, Math.round((cast / required) * 1000) / 10);
}

/** Fecha legible en español. */
export function formatDate(iso: string, withTime = false): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/** Cuenta regresiva a una fecha. Devuelve partes y si ya venció. */
export function countdownTo(iso: string, now = Date.now()) {
  const target = new Date(iso).getTime();
  const diff = target - now;
  const expired = diff <= 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const seconds = Math.floor((abs % 60_000) / 1000);
  return { expired, days, hours, minutes, seconds, diff };
}
