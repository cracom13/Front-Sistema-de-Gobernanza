"use client";

import { create } from "zustand";
import type { Proposal, TokenBalance, LedgerEvent } from "@/types";
import { MOCK_PROPOSALS, MOCK_LEDGER, mockBalance } from "@/lib/mock";

interface GovernanceState {
  balance: TokenBalance | null;
  proposals: Proposal[];
  ledger: LedgerEvent[];
  loading: boolean;
  /** Carga inicial (en demo usa mocks; en producción leería contratos). */
  hydrate: () => void;
  setBalance: (b: TokenBalance) => void;
  setProposals: (p: Proposal[]) => void;
  /** Registra localmente un voto recién emitido (optimista). */
  applyVote: (
    proposalId: string,
    choice: "for" | "against" | "abstain",
    weight: number,
    event: LedgerEvent
  ) => void;
}

export const useGovernanceStore = create<GovernanceState>((set) => ({
  balance: null,
  proposals: [],
  ledger: [],
  loading: true,
  hydrate: () =>
    set({
      balance: mockBalance(),
      proposals: MOCK_PROPOSALS,
      ledger: MOCK_LEDGER,
      loading: false,
    }),
  setBalance: (balance) => set({ balance }),
  setProposals: (proposals) => set({ proposals }),
  applyVote: (proposalId, choice, weight, event) =>
    set((state) => ({
      ledger: [event, ...state.ledger],
      proposals: state.proposals.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              tally: {
                ...p.tally,
                [choice]: p.tally[choice] + weight,
                totalCast: p.tally.totalCast + weight,
              },
            }
          : p
      ),
    })),
}));
