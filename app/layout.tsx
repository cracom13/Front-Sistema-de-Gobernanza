import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";

/*
  Inter: grotesco neutro, equivalente libre de la Suisse Int'l que usa la
  plantilla de referencia (Suisse es comercial y no se puede empaquetar sin
  licencia). Una sola familia para títulos y cuerpo, como el frame; Geist Mono
  se reserva para direcciones de wallet y hashes.
*/
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gobernanza Residencial · Asamblea y Votación",
  description:
    "Plataforma de gobernanza y votación descentralizada para copropiedades, sobre Avalanche Fuji. Tu voto se pondera por tu coeficiente de copropiedad, de forma transparente y verificable.",
};

/**
 * Sets data-theme before paint, from localStorage or the OS preference.
 * Runs as a blocking inline script so there is no flash of the wrong theme;
 * `suppressHydrationWarning` on <html> tells React not to complain about the
 * attribute it didn't render server-side.
 */
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${inter.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
