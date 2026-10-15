"use client";

import { type FormEvent, useState } from "react";
import { FilePlus2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { PROPOSAL_CATEGORY_LABEL } from "@/lib/constants";
import type { ProposalCategory } from "@/types";

export function ProposalCreator() {
  const [category, setCategory] = useState<ProposalCategory>("budget");
  const [created, setCreated] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // En producción: createProposal(signer, description, …)
    setCreated(true);
    setTimeout(() => setCreated(false), 5000);
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <FilePlus2 className="size-5 text-brass" />
        <h2 className="font-display text-lg font-semibold text-ink">
          Nueva propuesta
        </h2>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Al publicarla se toma el snapshot de saldos y comienza la votación en la
        fecha indicada.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title">Título</Label>
          <Input id="title" required placeholder="Ej. Presupuesto 2027 y cuota ordinaria" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            required
            rows={4}
            placeholder="Explique el asunto a decidir, en lenguaje claro para todos los copropietarios."
          />
        </div>

        <div className="space-y-1.5">
          <Label>Tipo de propuesta</Label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PROPOSAL_CATEGORY_LABEL) as ProposalCategory[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                  category === c
                    ? "border-brass bg-brass-wash text-ink"
                    : "border-rule bg-surface text-ink-soft hover:border-ink/30"
                }`}
              >
                {PROPOSAL_CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="start">Inicio de votación</Label>
            <Input id="start" type="datetime-local" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end">Cierre de votación</Label>
            <Input id="end" type="datetime-local" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quorum">Quórum mínimo (poder de voto)</Label>
          <Input id="quorum" inputMode="numeric" required placeholder="51000" />
          <p className="text-xs text-ink-faint">
            La Ley 675 exige mayorías según el tipo de decisión. Verifique el
            umbral correspondiente.
          </p>
        </div>

        {created && (
          <div className="flex items-start gap-2 rounded-lg border border-ok/30 bg-ok-wash px-3 py-2.5 text-sm text-ok">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            Propuesta creada. Aparecerá en el listado al confirmarse la
            transacción en la red.
          </div>
        )}

        <Button type="submit" variant="brass" size="lg" className="w-full sm:w-auto">
          <FilePlus2 className="size-5" /> Publicar propuesta
        </Button>
      </form>
    </Card>
  );
}
