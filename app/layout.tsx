import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";

const titilliumWeb = Titillium_Web({
  weight: ["200", "300", "400", "600", "700", "900"],
  variable: "--font-titillium-web",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teste Técnico - Nex Lab",
  description: "Teste Técnico - Nex Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${titilliumWeb.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
