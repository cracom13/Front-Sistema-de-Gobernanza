"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { buildJitsiConfig } from "@/lib/jitsi";
import type { Assembly, User } from "@/types";

/** API mínima del objeto externo de Jitsi (IFrame API). */
interface JitsiApi {
  addEventListener: (event: string, handler: (data: unknown) => void) => void;
  removeEventListener: (event: string, handler: (data: unknown) => void) => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
  getParticipantsInfo: () => Array<{ participantId: string; displayName: string }>;
  dispose: () => void;
}

interface Participant {
  id: string;
  displayName: string;
}

interface UseJitsiAssemblyState {
  participants: Participant[];
  localMuted: boolean;
  joined: boolean;
  /** Poder de voto estimado conectado (quórum en vivo). */
  connectedPower: number;
  quorumPercent: number;
}

/**
 * Gestiona el ciclo de vida de la sala de Jitsi de una asamblea:
 * participantes que entran/salen, estado de silencio y el cálculo del quórum
 * en vivo (porcentaje del poder de voto total conectado).
 *
 * `onApiReady` se pasa a <JitsiMeeting> del SDK; el resto expone estado reactivo.
 */
export function useJitsiAssembly(assembly: Assembly, user: User) {
  const apiRef = useRef<JitsiApi | null>(null);
  const [state, setState] = useState<UseJitsiAssemblyState>({
    participants: [],
    localMuted: true,
    joined: false,
    connectedPower: assembly.connectedPower,
    quorumPercent: Math.min(
      100,
      Math.round((assembly.connectedPower / assembly.totalEligiblePower) * 1000) / 10
    ),
  });

  const config = useMemo(() => buildJitsiConfig(assembly, user), [assembly, user]);

  /**
   * Estima el poder de voto conectado a partir del número de participantes.
   * En producción se cruza el `displayName`/identidad con el coeficiente real
   * de cada unidad; aquí se aproxima proporcionalmente.
   */
  const recomputeQuorum = useCallback(
    (participantCount: number) => {
      const avgPerUnit = assembly.totalEligiblePower / 80; // ~80 unidades
      const connected = Math.min(
        assembly.totalEligiblePower,
        Math.round(participantCount * avgPerUnit)
      );
      setState((s) => ({
        ...s,
        connectedPower: Math.max(connected, assembly.connectedPower),
        quorumPercent:
          Math.round(
            (Math.max(connected, assembly.connectedPower) /
              assembly.totalEligiblePower) *
              1000
          ) / 10,
      }));
    },
    [assembly.connectedPower, assembly.totalEligiblePower]
  );

  const syncParticipants = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    const info = api.getParticipantsInfo();
    const participants = info.map((p) => ({
      id: p.participantId,
      displayName: p.displayName,
    }));
    setState((s) => ({ ...s, participants }));
    recomputeQuorum(participants.length);
  }, [recomputeQuorum]);

  /** Conecta los listeners cuando el SDK entrega la API externa. */
  const handleApiReady = useCallback(
    (externalApi: unknown) => {
      const api = externalApi as JitsiApi;
      apiRef.current = api;

      const onJoin = () => {
        setState((s) => ({ ...s, joined: true }));
        syncParticipants();
      };
      const onParticipantJoined = () => syncParticipants();
      const onParticipantLeft = () => syncParticipants();
      const onAudioMute = (data: unknown) => {
        const muted = (data as { muted?: boolean })?.muted ?? false;
        setState((s) => ({ ...s, localMuted: muted }));
      };

      api.addEventListener("videoConferenceJoined", onJoin);
      api.addEventListener("participantJoined", onParticipantJoined);
      api.addEventListener("participantLeft", onParticipantLeft);
      api.addEventListener("audioMuteStatusChanged", onAudioMute);
    },
    [syncParticipants]
  );

  const toggleAudio = useCallback(() => {
    apiRef.current?.executeCommand("toggleAudio");
  }, []);

  const raiseHand = useCallback(() => {
    apiRef.current?.executeCommand("toggleRaiseHand");
  }, []);

  const leave = useCallback(() => {
    apiRef.current?.executeCommand("hangup");
    apiRef.current?.dispose();
    apiRef.current = null;
    setState((s) => ({ ...s, joined: false, participants: [] }));
  }, []);

  return { config, state, handleApiReady, toggleAudio, raiseHand, leave };
}
