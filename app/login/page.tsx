"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, Loader2, Scale } from "lucide-react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { Logo, Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const { login, status, user, isDemo } = useWeb3Auth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "connected" && user) {
      router.replace(user.onboardingComplete ? "/dashboard" : "/onboarding");
    }
  }, [status, user, router]);

  async function handleLogin() {
    setBusy(true);
    await login();
    setBusy(false);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* ── Lado izquierdo: el acta ── */}
      <section className="paper-grain relative flex flex-col justify-between overflow-hidden bg-ink px-6 py-10 text-paper sm:px-12 lg:py-14">
        <Wordmark className="[&_span:first-child]:text-paper [&_span:last-child]:text-brass-soft" />

        <div className="max-w-xl py-14">
          <p className="mb-5 inline-flex items-center gap-2 rounded-sm border border-paper/20 px-3 py-1 text-sm text-paper/80">
            <Scale className="size-4 text-brass-soft" />
            Ley 675 de 2001 · Asamblea de copropietarios
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            Su voto pesa
            <br />
            lo que le corresponde.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/75">
            La asamblea de su conjunto, ahora verificable. Cada voto se pondera
            por el coeficiente de copropiedad de su unidad y queda registrado de
            forma pública e inalterable.
          </p>

          {/* La fórmula como objeto característico del producto */}
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-lg border border-paper/15 bg-paper/10 text-center font-tnum">
            <div className="bg-ink/60 px-3 py-4">
              <dt className="text-xs text-paper/60">Coeficiente</dt>
              <dd className="mt-1 font-display text-2xl text-paper">2,45%</dd>
            </div>
            <div className="bg-ink/40 px-3 py-4">
              <dt className="text-xs text-paper/60">Tokens</dt>
              <dd className="mt-1 font-display text-2xl text-brass-soft">2.450</dd>
            </div>
            <div className="bg-brass/20 px-3 py-4">
              <dt className="text-xs text-paper/60">Poder efectivo</dt>
              <dd className="mt-1 font-display text-2xl text-brass-soft">2.082</dd>
            </div>
          </dl>
        </div>

        <p className="text-sm text-paper/50">
          Conjunto Residencial Altos del Nogal · Red Avalanche Fuji
        </p>
      </section>

      {/* ── Lado derecho: ingreso ── */}
      <section className="relative flex items-center justify-center bg-paper px-6 py-12">
        <ThemeToggle className="absolute right-4 top-4" />
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size={44} />
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Entrar a su asamblea
          </h2>
          <p className="mt-2 text-ink-soft leading-relaxed">
            Reciba un código en su correo. Creamos y protegemos su billetera por
            usted: no necesita recordar claves ni frases secretas.
          </p>

          <Button
            onClick={handleLogin}
            disabled={busy || status === "connecting"}
            size="lg"
            className="mt-7 w-full"
          >
            {busy || status === "connecting" ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Conectando…
              </>
            ) : (
              <>
                <Mail className="size-5" />
                Continuar con mi correo
              </>
            )}
          </Button>

          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-rule bg-surface p-4 text-sm text-ink-soft">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ok" />
            <p>
              Su billetera se genera de forma segura con Web3Auth. La clave
              privada nunca se muestra ni se almacena en esta aplicación.
            </p>
          </div>

          {isDemo && (
            <p className="mt-5 rounded-sm border border-brass/30 bg-brass-wash px-3 py-2 text-xs text-brass">
              Modo demostración activo: sin un <code>CLIENT_ID</code> de
              Web3Auth, ingresará con un perfil de ejemplo (Carlos Pérez, Torre 2
              Apto 301).
            </p>
          )}

          <p className="mt-8 text-center text-xs text-ink-faint">
            ¿Problemas para ingresar? Escriba a la administración del conjunto.
          </p>
        </div>
      </section>
    </main>
  );
}
