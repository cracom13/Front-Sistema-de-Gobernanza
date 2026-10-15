/**
 * Nombre exacto del repositorio de GitHub. GitHub Pages sirve los sitios de
 * proyecto en usuario.github.io/<repo>/, no en la raíz, así que Next.js
 * necesita saberlo para que las rutas de assets (_next/...) no queden rotas.
 *
 * El workflow de GitHub Actions (.github/workflows/deploy.yml) activa
 * GITHUB_PAGES=true; en local (`npm run dev` / `npm run build` normal) el
 * sitio sigue viviendo en la raíz, sin basePath.
 */
const REPO_NAME = "Front-Sistema-de-Gobernanza";
const isGithubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GitHub Pages es hosting 100% estático: sin servidor Node, sin SSR/API routes.
  output: "export",
  basePath: isGithubPages ? `/${REPO_NAME}` : "",
  assetPrefix: isGithubPages ? `/${REPO_NAME}/` : "",
  // Cada ruta exporta como carpeta/index.html; evita enlaces internos rotos
  // en hosts estáticos que no infieren index.html sin la barra final.
  trailingSlash: true,
  // next/image necesita esto sin un servidor de optimización de imágenes.
  images: { unoptimized: true },
  webpack: (config) => {
    // Web3Auth / ethers browser polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
