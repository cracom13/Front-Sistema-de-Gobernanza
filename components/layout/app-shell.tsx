"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Building2 } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { NAV_ITEMS } from "./nav-items";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { shortAddress, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssistantWidget } from "@/components/assistant/assistant-widget";
import { ThemeToggle } from "@/components/theme-toggle";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useWeb3Auth();
  const items = NAV_ITEMS.filter((i) => !i.adminOnly || user?.role === "admin");

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Navegación principal">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href.split("/").slice(0, 2).join("/")));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-start gap-3 rounded px-3 py-2.5 transition-colors",
              active
                ? "bg-brass-wash text-ink"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 size-5 shrink-0",
                active ? "text-brass" : "text-ink-faint group-hover:text-ink-soft"
              )}
            />
            <span className="leading-tight">
              <span className="block text-sm font-semibold">{item.label}</span>
              <span className="block text-xs text-ink-faint">{item.hint}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function UnitCard() {
  const { user } = useWeb3Auth();
  if (!user) return null;
  return (
    <div className="rounded-lg border border-rule bg-paper p-3">
      <div className="flex items-center gap-2 text-ink-soft">
        <Building2 className="size-4 text-brass" />
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Tu unidad
        </span>
      </div>
      <p className="mt-1.5 font-display text-base font-semibold text-ink">
        Torre {user.unit.tower} · Apto {user.unit.apartment}
      </p>
      <p className="text-xs text-ink-soft">
        Coeficiente {user.unit.coefficient.toFixed(2)}%
      </p>
      <p className="wallet-mono mt-2 text-xs text-ink-faint">
        {shortAddress(user.walletAddress)}
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useWeb3Auth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[18rem_1fr]">
      {/* ── Riel lateral (desktop) — índice del libro de actas ── */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-rule bg-surface lg:flex">
        <div className="border-b border-rule px-5 py-5">
          <Link href="/dashboard" className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass">
            <Wordmark />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks />
        </div>
        <div className="space-y-3 border-t border-rule p-3">
          <UnitCard />
          <ThemeToggle labeled />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-ink-soft"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* ── Barra superior (móvil) ── */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-rule bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          <Wordmark />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="rounded p-2 text-ink hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </header>

        {/* Drawer móvil */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-surface shadow-float animate-rise-in">
              <div className="flex items-center justify-between border-b border-rule px-5 py-4">
                <Wordmark />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                  className="rounded p-2 text-ink hover:bg-ink/5"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
              <div className="space-y-3 border-t border-rule p-3">
                <UnitCard />
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                  <LogOut className="size-4" />
                  Cerrar sesión
                </Button>
              </div>
              {/* El toggle ya vive en el header móvil; se omite aquí para no duplicarlo. */}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Asistente IA flotante, global */}
      {user && <AssistantWidget />}
    </div>
  );
}
