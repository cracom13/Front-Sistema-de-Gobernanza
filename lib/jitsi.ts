import { JITSI_DOMAIN } from "./constants";
import type { JitsiConfig, User, Assembly } from "@/types";

/**
 * Construye la configuración de Jitsi Meet para una asamblea.
 * - roomName = id de la asamblea (sala automática).
 * - displayName = "Nombre - Torre X Apto Y" (no editable por el residente).
 * - Se deshabilitan controles de moderación para residentes.
 */
export function buildJitsiConfig(
  assembly: Pick<Assembly, "roomName">,
  user: Pick<User, "fullName" | "email" | "unit">
): JitsiConfig {
  const { tower, apartment } = user.unit;
  const displayName = `${user.fullName} - Torre ${tower} Apto ${apartment}`;

  return {
    domain: JITSI_DOMAIN,
    roomName: `gobernanza-${assembly.roomName}`,
    displayName,
    email: user.email,
    configOverwrite: {
      startWithAudioMuted: true,
      startWithVideoMuted: false,
      disableProfile: true, // impide editar el perfil / nombre
      prejoinPageEnabled: false,
      readOnlyName: true, // el nombre no se puede cambiar
      disableRemoteMute: true,
      remoteVideoMenu: { disableKick: true, disableGrantModerator: true },
    },
    interfaceConfigOverwrite: {
      // Toolbar restringida: sin "expulsar", sin "convertir en moderador".
      TOOLBAR_BUTTONS: [
        "microphone",
        "camera",
        "desktop",
        "fullscreen",
        "hangup",
        "chat",
        "raisehand",
        "tileview",
        "settings",
      ],
      SHOW_JITSI_WATERMARK: false,
      DISABLE_PRESENCE_STATUS: true,
    },
  };
}
