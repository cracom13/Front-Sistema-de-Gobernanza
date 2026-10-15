"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, IdCard, Percent, ArrowRight, CheckCircle2 } from "lucide-react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { shortAddress } from "@/lib/utils";

export default function OnboardingPage() {
  const { user, status, updateProfile } = useWeb3Auth();
  const router = useRouter();
  const [tower, setTower] = useState("");
  const [apartment, setApartment] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [idDocument, setIdDocument] = useState("");

  useEffect(() => {
    if (status !== "connecting" && status !== "initializing" && !user) {
      router.replace("/login");
    }
    if (user?.onboardingComplete) router.replace("/dashboard");
  }, [user, status, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    updateProfile({
      unit: {
        id: `T${tower}-${apartment}`,
        tower,
        apartment,
        coefficient: parseFloat(coefficient) || 0,
      },
      idDocument,
      onboardingComplete: true,
    });
    router.push("/dashboard");
  }

  if (!user) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 py-12">
      <div className="w-full max-w-lg">
        <Wordmark className="mb-8" />
        <div className="rounded-lg border border-rule bg-surface p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Registre su unidad
          </h1>
          <p className="mt-2 text-ink-soft leading-relaxed">
            Vinculamos su billetera a su apartamento. Estos datos determinan el
            peso de su voto en la asamblea.
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-sm border border-ok/30 bg-ok-wash px-3 py-2 text-sm text-ok">
            <CheckCircle2 className="size-4 shrink-0" />
            Billetera creada:
            <span className="wallet-mono font-semibold">
              {shortAddress(user.walletAddress)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tower" className="flex items-center gap-1.5">
                  <Building2 className="size-4 text-brass" /> Torre
                </Label>
                <Input
                  id="tower"
                  required
                  inputMode="numeric"
                  placeholder="2"
                  value={tower}
                  onChange={(e) => setTower(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apartment">Apartamento</Label>
                <Input
                  id="apartment"
                  required
                  inputMode="numeric"
                  placeholder="301"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coefficient" className="flex items-center gap-1.5">
                <Percent className="size-4 text-brass" /> Coeficiente de copropiedad
              </Label>
              <Input
                id="coefficient"
                required
                inputMode="decimal"
                placeholder="2.45"
                value={coefficient}
                onChange={(e) => setCoefficient(e.target.value)}
              />
              <p className="text-xs text-ink-faint">
                Aparece en su escritura y en el reglamento de propiedad horizontal.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="idDocument" className="flex items-center gap-1.5">
                <IdCard className="size-4 text-brass" /> Documento de identidad
              </Label>
              <Input
                id="idDocument"
                required
                placeholder="C.C. 79 123 456"
                value={idDocument}
                onChange={(e) => setIdDocument(e.target.value)}
              />
              <p className="text-xs text-ink-faint">
                Se usa solo para verificar su propiedad. Se almacena cifrado,
                fuera de la cadena de bloques.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Guardar y entrar
              <ArrowRight className="size-5" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
