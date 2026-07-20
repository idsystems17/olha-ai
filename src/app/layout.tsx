import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
const TITULO = "Olha Aí — seu catálogo no link do WhatsApp";
const DESCRICAO =
  "Catálogo digital simples e prático pra quem vende pelo WhatsApp. Foto, preço e um botão que já leva pro pedido pronto — sem taxa por venda, sem aplicativo pra instalar.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: TITULO, template: "%s · Olha Aí" },
  description: DESCRICAO,
  keywords: [
    "catálogo digital",
    "catálogo para WhatsApp",
    "cardápio digital",
    "vender pelo WhatsApp",
    "loja online informal",
    "autônomo",
    "vendedora informal",
  ],
  authors: [{ name: "Olha Aí" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Olha Aí",
    title: TITULO,
    description: DESCRICAO,
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
