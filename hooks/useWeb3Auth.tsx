"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Web3Auth } from "@web3auth/modal";
import type { IProvider } from "@web3auth/base";
import { BrowserProvider, type Signer } from "ethers";
import { createWeb3Auth } from "@/lib/web3auth";
import { WEB3AUTH } from "@/lib/constants";
import { MOCK_USER } from "@/lib/mock";
import type { User } from "@/types";

type AuthStatus =
  | "initializing"
  | "ready" // SDK listo, sin sesión
  | "connecting"
  | "connected"
  | "demo" // sin clientId: modo demostración
  | "error";

interface Web3AuthContextValue {
  status: AuthStatus;
  user: User | null;
  address: string | null;
  /** Proveedor EIP-1193 crudo (Web3Auth) para construir signers. */
  provider: IProvider | null;
  isDemo: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getSigner: () => Promise<Signer | null>;
  /** Actualiza el perfil tras el onboarding (unidad, coeficiente, cédula). */
  updateProfile: (patch: Partial<User>) => void;
}

const Web3AuthContext = createContext<Web3AuthContextValue | null>(null);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const web3authRef = useRef<Web3Auth | null>(null);
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const [user, setUser] = useState<User | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDemo = !WEB3AUTH.clientId;

  // Inicialización del SDK (solo navegador).
  useEffect(() => {
    let active = true;
    (async () => {
      if (isDemo) {
        setStatus("demo");
        return;
      }
      try {
        const w3a = createWeb3Auth();
        web3authRef.current = w3a;
        await w3a.initModal();
        if (!active) return;
        if (w3a.connected && w3a.provider) {
          setProvider(w3a.provider);
          await hydrateUser(w3a);
          setStatus("connected");
        } else {
          setStatus("ready");
        }
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Error al inicializar Web3Auth");
        setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  /** Deriva usuario (email + wallet) desde la sesión de Web3Auth. */
  async function hydrateUser(w3a: Web3Auth) {
    if (!w3a.provider) return;
    const [info, address] = await Promise.all([
      w3a.getUserInfo().catch(() => ({} as Record<string, string>)),
      new BrowserProvider(w3a.provider)
        .getSigner()
        .then((s) => s.getAddress()),
    ]);
    setUser((prev) => ({
      ...MOCK_USER, // valores por defecto de unidad hasta completar onboarding
      ...prev,
      id: (info as { verifierId?: string }).verifierId ?? MOCK_USER.id,
      fullName: (info as { name?: string }).name ?? "Residente",
      email: (info as { email?: string }).email ?? "",
      walletAddress: address,
      onboardingComplete: prev?.onboardingComplete ?? false,
    }));
  }

  const login = useCallback(async () => {
    if (isDemo) {
      setUser(MOCK_USER);
      setStatus("connected");
      return;
    }
    const w3a = web3authRef.current;
    if (!w3a) return;
    setStatus("connecting");
    try {
      const prov = await w3a.connect();
      setProvider(prov);
      await hydrateUser(w3a);
      setStatus("connected");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión");
      setStatus("ready");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  const logout = useCallback(async () => {
    const w3a = web3authRef.current;
    if (w3a?.connected) await w3a.logout();
    setUser(null);
    setProvider(null);
    setStatus(isDemo ? "demo" : "ready");
  }, [isDemo]);

  const getSigner = useCallback(async (): Promise<Signer | null> => {
    if (!provider) return null;
    const browserProvider = new BrowserProvider(provider);
    return browserProvider.getSigner();
  }, [provider]);

  const updateProfile = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = useMemo<Web3AuthContextValue>(
    () => ({
      status,
      user,
      address: user?.walletAddress ?? null,
      provider,
      isDemo,
      error,
      login,
      logout,
      getSigner,
      updateProfile,
    }),
    [status, user, provider, isDemo, error, login, logout, getSigner, updateProfile]
  );

  return (
    <Web3AuthContext.Provider value={value}>{children}</Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  const ctx = useContext(Web3AuthContext);
  if (!ctx)
    throw new Error("useWeb3Auth debe usarse dentro de <Web3AuthProvider>");
  return ctx;
}
