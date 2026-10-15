# Gobernanza y Votación Descentralizada Residencial

Frontend de la plataforma de asamblea y votación para copropiedades, sobre
**Avalanche Fuji Testnet** (Chain ID 43113). El voto se pondera por el
coeficiente de copropiedad y se ajusta por el estado de morosidad (Ley 675 de
2001, Sentencia T-633 de 2003), con registro público y verificable en cadena.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + primitivas Radix UI estilo shadcn + **Lucide Icons**
- **ethers v6** + **Web3Auth** (`@web3auth/modal`) — wallet embebida por correo
- **@jitsi/react-sdk** — sala de asamblea en vivo
- **Zustand** — estado global de gobernanza

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # complete sus credenciales
npm run dev                  # http://localhost:3000
```

> **Modo demostración:** sin `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`, la app inicia
> sesión con un perfil de ejemplo y simula las firmas on-chain, de modo que
> todas las pantallas funcionan sin contratos desplegados. Complete el
> `CLIENT_ID` y las direcciones de los contratos para conectar con Fuji real.

## Variables de entorno

Ver `.env.example`. Las claves principales:

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | Client ID de Web3Auth (dashboard.web3auth.io) |
| `NEXT_PUBLIC_RPC_URL` | RPC de Fuji (por defecto el público de Avalanche) |
| `NEXT_PUBLIC_GOV_TOKEN_ADDRESS` | Token ERC-20 de gobernanza (con snapshot) |
| `NEXT_PUBLIC_GOVERNOR_ADDRESS` | Contrato de votación (estilo Governor) |
| `NEXT_PUBLIC_ASSISTANT_WEBHOOK_URL` | Webhook del orquestador n8n (asistente IA) |

## Estructura

```
app/
  (app)/                 Rutas autenticadas (shell con riel lateral)
    dashboard/           Panel del residente — héroe: derivación del voto
    proposals/           Listado + detalle con votación on-chain
    assembly/[id]/       Asamblea en vivo (Jitsi) en pantalla dividida
    transparency/        Tablero de transparencia / registro inmutable
    admin/               Gestión de residentes, AirDrops y propuestas
  login/                 Ingreso con correo (Web3Auth)
  onboarding/            Registro de unidad, coeficiente y cédula
components/              UI, dominio (propuestas, asamblea, admin) y marca
hooks/                   useWeb3Auth, useJitsiAssembly, useCountUp
lib/                     constants, utils, contracts (ethers), web3auth, jitsi
store/                   Estado global (Zustand)
types/                   Modelo de dominio
```

## Reglas de negocio implementadas

- **Voto ponderado:** `poder efectivo = tokens − (tokens × penalización por mora)`,
  con los tokens proporcionales al coeficiente. Ver `lib/utils.ts`.
- **Snapshot anti-manipulación:** cada propuesta muestra su bloque de captura de
  saldos; el peso del voto se lee de `getPastVotes`.
- **Transparencia (Shameboard):** cada evento enlaza a Snowtrace.

## Diseño

Sistema visual "Vinotinto Executive Terminal": estética de centro de control
obsidiana + vinotinto, con micro-bordes en lugar de sombras pesadas y un brillo
(`glow`) sutil en los estados activos/hover de la acción principal.

- **Tipografía:** Space Grotesk (`font-display` — KPIs, títulos, métricas) +
  Geist (`font-sans` — cuerpo, labels) + Geist Mono (`font-mono` — wallets,
  hashes). Escala semántica disponible como `text-display-lg`, `text-headline-*`,
  `text-label-*` y `text-metric-val` (`tailwind.config.ts`).
- **Modo claro / oscuro:** toggle real (no solo preferencia del sistema) vía
  `hooks/useTheme.ts` + `components/theme-toggle.tsx`, persistido en
  `localStorage` y aplicado como `data-theme` en `<html>` por un script
  bloqueante en `app/layout.tsx` (sin parpadeo al cargar). Los tokens de color
  de ambos temas viven en `app/globals.css`.
- **Accesibilidad:** verde/rojo de "Al Día / En Mora" se mantienen fuera del
  tono de marca (vinotinto) a propósito, para no competir visualmente; WCAG
  2.1 AA, foco de teclado visible y `prefers-reduced-motion` respetado.
