"use client";

import { useRef, useState } from "react";
import { MessageCircleQuestion, X, Send, Loader2 } from "lucide-react";
import { ASSISTANT_WEBHOOK } from "@/lib/constants";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { cn } from "@/lib/utils";
import type { AssistantMessage } from "@/types";

const SUGGESTIONS = [
  "¿Cómo voto una propuesta?",
  "¿Cuántos tokens tengo?",
  "¿Por qué mi voto pesa diferente?",
  "¿Cuándo es la próxima asamblea?",
];

/**
 * Asistente virtual flotante. Diseñado para residentes no técnicos y adultos
 * mayores: texto grande, lenguaje sencillo, preguntas sugeridas. Envía las
 * consultas a un orquestador n8n vía webhook REST.
 */
export function AssistantWidget() {
  const { user } = useWeb3Auth();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hola, soy su asistente de la asamblea. Puedo explicarle cómo votar, cuántos tokens tiene o cuándo es la próxima reunión. ¿En qué le ayudo?",
      at: new Date().toISOString(),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || sending) return;
    const userMsg: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    );

    try {
      let reply =
        "Gracias por su pregunta. En un momento le responderé con la información de su conjunto.";
      if (ASSISTANT_WEBHOOK) {
        const res = await fetch(ASSISTANT_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: content,
            wallet: user?.walletAddress,
            unit: user ? `Torre ${user.unit.tower} Apto ${user.unit.apartment}` : null,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { reply?: string; answer?: string };
        reply = data.reply ?? data.answer ?? reply;
      }
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: reply, at: new Date().toISOString() },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "No pude conectarme en este momento. Intente de nuevo o escriba a la administración.",
          at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
      );
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente virtual"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full px-5 py-3.5 text-sm font-semibold shadow-float transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
          open ? "bg-ink text-paper" : "bg-brass text-surface"
        )}
      >
        {open ? <X className="size-5" /> : <MessageCircleQuestion className="size-5" />}
        {!open && <span className="hidden sm:inline">¿Necesita ayuda?</span>}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Asistente virtual"
          className="fixed bottom-24 right-5 z-40 flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-lg border border-rule bg-surface shadow-float animate-rise-in"
        >
          <header className="flex items-center gap-2 border-b border-rule bg-ink px-4 py-3 text-paper">
            <MessageCircleQuestion className="size-5 text-brass-soft" />
            <div className="leading-tight">
              <p className="font-display text-base font-semibold">Asistente de la asamblea</p>
              <p className="text-xs text-paper/70">Preguntas sencillas, respuestas claras</p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-lg px-3.5 py-2.5 text-[15px] leading-relaxed",
                  m.role === "assistant"
                    ? "bg-paper text-ink"
                    : "ml-auto bg-ink text-paper"
                )}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-sm text-ink-faint">
                <Loader2 className="size-4 animate-spin" /> Pensando…
              </div>
            )}
            {messages.length <= 1 && (
              <div className="space-y-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full rounded border border-rule bg-paper px-3 py-2 text-left text-sm text-ink-soft hover:border-brass hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-rule p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escriba su pregunta…"
              aria-label="Escriba su pregunta"
              className="flex-1 rounded border border-rule bg-paper px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-brass focus-visible:ring-2 focus-visible:ring-brass/30"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Enviar pregunta"
              className="flex size-11 shrink-0 items-center justify-center rounded bg-brass text-surface disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
