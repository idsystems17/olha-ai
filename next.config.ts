import type { NextConfig } from "next";

// unsafe-eval só em dev — o Turbopack/webpack HMR precisa disso pra recarregar
// módulo sem refresh da página. Em produção fica sem, mais restrito.
const scriptSrc = process.env.NODE_ENV === "development"
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'"

// 'unsafe-inline' em script/style ainda é necessário porque o Next.js App
// Router injeta scripts inline de hidratação sem nonce configurado — fechar
// isso de vez exigiria plumbing de nonce por request no proxy.ts. Os demais
// headers (frame-ancestors, nosniff, referrer, permissions) não têm esse
// trade-off e já bloqueiam clickjacking e MIME-sniffing por completo.
const CSP = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};

export default nextConfig;
