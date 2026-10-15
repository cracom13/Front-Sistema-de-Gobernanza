import {
  BrowserProvider,
  Contract,
  JsonRpcProvider,
  formatUnits,
  type Signer,
} from "ethers";
import { CONTRACTS, FUJI, GOV_TOKEN } from "./constants";
import type { Proposal, ProposalTally, VoteChoice } from "@/types";

/**
 * Capa de acceso a contratos — token ERC-20 de gobernanza (con snapshot /
 * ERC20Votes) y contrato de votación (estilo Governor) en Avalanche Fuji.
 *
 * Las funciones de LECTURA usan un provider RPC público (no requieren wallet).
 * Las funciones de ESCRITURA requieren un Signer de Web3Auth.
 */

// ─── ABIs mínimas ────────────────────────────────────────────────────────────

export const GOV_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  // Snapshot de poder de voto (ERC20Votes / OpenZeppelin)
  "function getVotes(address account) view returns (uint256)",
  "function getPastVotes(address account, uint256 timepoint) view returns (uint256)",
  "function getPastTotalSupply(uint256 timepoint) view returns (uint256)",
  "function delegate(address delegatee)",
  // Airdrop administrativo (función custom del token de gobernanza)
  "function airdrop(address[] recipients, uint256[] amounts)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
] as const;

export const GOVERNOR_ABI = [
  "function state(uint256 proposalId) view returns (uint8)",
  "function proposalSnapshot(uint256 proposalId) view returns (uint256)",
  "function proposalDeadline(uint256 proposalId) view returns (uint256)",
  "function quorum(uint256 timepoint) view returns (uint256)",
  "function hasVoted(uint256 proposalId, address account) view returns (bool)",
  "function proposalVotes(uint256 proposalId) view returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes)",
  // support: 0 = Against, 1 = For, 2 = Abstain
  "function castVote(uint256 proposalId, uint8 support) returns (uint256)",
  "function castVoteWithReason(uint256 proposalId, uint8 support, string reason) returns (uint256)",
  "function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) returns (uint256)",
  "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)",
] as const;

/** Mapea VoteChoice del dominio a `support` del contrato Governor. */
export const SUPPORT: Record<VoteChoice, number> = {
  against: 0,
  for: 1,
  abstain: 2,
};

// ─── Providers y contratos ───────────────────────────────────────────────────

let _readProvider: JsonRpcProvider | null = null;

/** Provider de solo lectura contra el RPC público de Fuji. */
export function getReadProvider(): JsonRpcProvider {
  if (!_readProvider) {
    _readProvider = new JsonRpcProvider(FUJI.rpcUrl, {
      chainId: FUJI.chainId,
      name: FUJI.name,
    });
  }
  return _readProvider;
}

export function govTokenRead() {
  return new Contract(CONTRACTS.govToken, GOV_TOKEN_ABI, getReadProvider());
}

export function governorRead() {
  return new Contract(CONTRACTS.governor, GOVERNOR_ABI, getReadProvider());
}

export function govTokenWrite(signer: Signer) {
  return new Contract(CONTRACTS.govToken, GOV_TOKEN_ABI, signer);
}

export function governorWrite(signer: Signer) {
  return new Contract(CONTRACTS.governor, GOVERNOR_ABI, signer);
}

// ─── Lecturas ─────────────────────────────────────────────────────────────────

/** Saldo bruto de tokens de gobernanza. */
export async function readBalance(address: string) {
  const token = govTokenRead();
  const [raw, decimals, symbol] = await Promise.all([
    token.balanceOf(address) as Promise<bigint>,
    token.decimals().catch(() => BigInt(GOV_TOKEN.decimals)) as Promise<bigint>,
    token.symbol().catch(() => GOV_TOKEN.symbol) as Promise<string>,
  ]);
  return {
    raw: raw.toString(),
    decimals: Number(decimals),
    symbol,
    formatted: formatUnits(raw, Number(decimals)),
  };
}

/** Poder de voto vigente (según snapshot ERC20Votes). */
export async function readVotingPower(address: string, decimals = GOV_TOKEN.decimals) {
  const votes = (await govTokenRead().getVotes(address)) as bigint;
  return formatUnits(votes, decimals);
}

/** Lee el conteo de votos de una propuesta y lo normaliza al dominio. */
export async function readProposalTally(
  proposalId: string,
  decimals = GOV_TOKEN.decimals
): Promise<ProposalTally> {
  const [against, forVotes, abstain] =
    (await governorRead().proposalVotes(proposalId)) as [bigint, bigint, bigint];
  const f = Number(formatUnits(forVotes, decimals));
  const a = Number(formatUnits(against, decimals));
  const ab = Number(formatUnits(abstain, decimals));
  return { for: f, against: a, abstain: ab, totalCast: f + a + ab };
}

/** ¿La wallet ya votó esta propuesta? */
export async function readHasVoted(proposalId: string, address: string) {
  return (await governorRead().hasVoted(proposalId, address)) as boolean;
}

// ─── Escrituras ─────────────────────────────────────────────────────────────

/**
 * Emite un voto on-chain. Devuelve el hash de la transacción tras la firma
 * y espera 1 confirmación.
 */
export async function castVote(
  signer: Signer,
  proposalId: string,
  choice: VoteChoice,
  reason = ""
): Promise<{ hash: string; blockNumber: number }> {
  const governor = governorWrite(signer);
  const tx = reason
    ? await governor.castVoteWithReason(proposalId, SUPPORT[choice], reason)
    : await governor.castVote(proposalId, SUPPORT[choice]);
  const receipt = await tx.wait(1);
  return { hash: tx.hash, blockNumber: receipt?.blockNumber ?? 0 };
}

/** AirDrop masivo de tokens a propietarios (solo administrador). */
export async function airdropTokens(
  signer: Signer,
  recipients: string[],
  amountsWei: bigint[]
): Promise<string> {
  const token = govTokenWrite(signer);
  const tx = await token.airdrop(recipients, amountsWei);
  await tx.wait(1);
  return tx.hash;
}

/** Crea una propuesta (solo administrador / proponente autorizado). */
export async function createProposal(
  signer: Signer,
  description: string,
  targets: string[] = [],
  values: bigint[] = [],
  calldatas: string[] = []
): Promise<{ hash: string; proposalId: string }> {
  const governor = governorWrite(signer);
  const tx = await governor.propose(targets, values, calldatas, description);
  const receipt = await tx.wait(1);
  // El proposalId se emite en el evento ProposalCreated; aquí se devuelve el hash.
  return { hash: tx.hash, proposalId: receipt?.logs?.[0]?.topics?.[1] ?? "" };
}

/** Helper para construir un signer a partir del provider de Web3Auth. */
export async function signerFrom(eip1193Provider: unknown): Promise<Signer> {
  const browserProvider = new BrowserProvider(eip1193Provider as never);
  return browserProvider.getSigner();
}

// Mantiene `Proposal` referenciado para consumidores del módulo.
export type { Proposal };
