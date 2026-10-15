"use client";

import { type ReactNode, useEffect } from "react";
import { Web3AuthProvider } from "@/hooks/useWeb3Auth";
import { useGovernanceStore } from "@/store/useGovernanceStore";

function StoreHydrator({ children }: { children: ReactNode }) {
  const hydrate = useGovernanceStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Web3AuthProvider>
      <StoreHydrator>{children}</StoreHydrator>
    </Web3AuthProvider>
  );
}
