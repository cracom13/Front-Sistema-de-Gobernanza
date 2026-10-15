"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { AppShell } from "@/components/layout/app-shell";
import { Logo } from "@/components/brand/logo";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, user } = useWeb3Auth();
  const router = useRouter();

  const authed = status === "connected" && !!user;
  const resolving = status === "initializing" || status === "connecting";

  useEffect(() => {
    if (!resolving && !authed) router.replace("/login");
  }, [resolving, authed, router]);

  useEffect(() => {
    if (authed && user && !user.onboardingComplete) router.replace("/onboarding");
  }, [authed, user, router]);

  if (resolving || !authed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper">
        <Logo size={56} className="animate-fade-in" />
        <div className="flex items-center gap-2 text-ink-soft">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">Verificando su sesión…</span>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
