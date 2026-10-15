"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { JitsiConfig } from "@/types";

/** Carga diferida del SDK de Jitsi (no admite SSR). */
const JitsiMeeting = dynamic(
  () => import("@jitsi/react-sdk").then((m) => m.JitsiMeeting),
  {
    ssr: false,
    loading: () => <RoomSkeleton />,
  }
);

function RoomSkeleton() {
  return (
    <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-3 bg-ink text-paper">
      <Loader2 className="size-7 animate-spin text-brass-soft" />
      <p className="text-sm text-paper/70">Conectando a la sala de la asamblea…</p>
    </div>
  );
}

/**
 * Reproductor de videoconferencia Jitsi, responsive, que ocupa su contenedor.
 * El nombre visible y las restricciones vienen de `buildJitsiConfig`.
 */
export function JitsiRoom({
  config,
  onApiReady,
}: {
  config: JitsiConfig;
  onApiReady: (api: unknown) => void;
}) {
  return (
    <div className="h-full min-h-[22rem] overflow-hidden bg-ink [&>div]:h-full [&_iframe]:h-full [&_iframe]:w-full">
      <JitsiMeeting
        domain={config.domain}
        roomName={config.roomName}
        configOverwrite={config.configOverwrite as never}
        interfaceConfigOverwrite={config.interfaceConfigOverwrite as never}
        userInfo={{ displayName: config.displayName, email: config.email ?? "" }}
        onApiReady={onApiReady}
        getIFrameRef={(node: HTMLDivElement) => {
          node.style.height = "100%";
          node.style.width = "100%";
        }}
      />
    </div>
  );
}
