/** Configuración de red y contratos — Avalanche Fuji Testnet. */

export const FUJI = {
  chainId: 43113,
  chainIdHex: "0xa869",
  name: "Avalanche Fuji Testnet",
  currency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
  rpcUrl:
    process.env.NEXT_PUBLIC_RPC_URL ??
    "https://api.avax-test.network/ext/bc/C/rpc",
  explorerUrl:
    process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://testnet.snowtrace.io",
} as const;

export const CONTRACTS = {
  govToken: (process.env.NEXT_PUBLIC_GOV_TOKEN_ADDRESS ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
  governor: (process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
} as const;

export const WEB3AUTH = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? "",
  network: (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK ??
    "sapphire_devnet") as string,
} as const;

export const JITSI_DOMAIN =
  process.env.NEXT_PUBLIC_JITSI_DOMAIN ?? "meet.jit.si";

export const ASSISTANT_WEBHOOK =
  process.env.NEXT_PUBLIC_ASSISTANT_WEBHOOK_URL ?? "";

/** Símbolo y decimales del token de gobernanza. */
export const GOV_TOKEN = { symbol: "COPR", decimals: 18 } as const;

/** Enlaces a Snowtrace. */
export const snowtrace = {
  address: (addr: string) => `${FUJI.explorerUrl}/address/${addr}`,
  tx: (hash: string) => `${FUJI.explorerUrl}/tx/${hash}`,
  token: (addr: string) => `${FUJI.explorerUrl}/token/${addr}`,
};

/** Etiquetas en español para el dominio. */
export const PROPOSAL_STATUS_LABEL = {
  pending: "Pendiente",
  active: "Activa",
  closed: "Cerrada",
} as const;

export const PROPOSAL_CATEGORY_LABEL = {
  budget: "Presupuesto",
  coexistence: "Convivencia",
  works: "Obras",
} as const;

export const VOTE_CHOICE_LABEL = {
  for: "A Favor",
  against: "En Contra",
  abstain: "Abstención",
} as const;

export const LEDGER_EVENT_LABEL = {
  airdrop: "AirDrop recibido",
  transfer: "Transferencia",
  vote: "Voto emitido",
} as const;
