import {
  LayoutDashboard,
  Vote,
  Video,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Mi panel",
    hint: "Tu poder de voto y estado",
    icon: LayoutDashboard,
  },
  {
    href: "/proposals",
    label: "Propuestas",
    hint: "Vota los asuntos del conjunto",
    icon: Vote,
  },
  {
    href: "/assembly/asamblea-ordinaria-2026",
    label: "Asamblea en vivo",
    hint: "Reunión por videollamada",
    icon: Video,
  },
  {
    href: "/transparency",
    label: "Transparencia",
    hint: "Registro público on-chain",
    icon: ScrollText,
  },
  {
    href: "/admin",
    label: "Administración",
    hint: "Gestión de residentes",
    icon: ShieldCheck,
    adminOnly: true,
  },
];
