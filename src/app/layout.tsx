import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Shell from "@/components/console/Shell";
import "./globals.css";

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://yeo-portfolio-theta.vercel.app"),
  title: { default: "Yomoyaha Yeo — Développeur logiciel", template: "%s — Yomoyaha Yeo" },
  description:
    "Portfolio de Yomoyaha Yeo, développeur logiciel en Master 1 Cybersécurité et Intelligence Artificielle à l'ESATIC (Abidjan) : dossiers de projets, chronologie, compétences, activité GitHub et contact.",
  openGraph: {
    title: "Yomoyaha Yeo — Développeur logiciel",
    description: "Développeur logiciel, spécialisé en cybersécurité et en intelligence artificielle.",
    type: "website",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0e1013" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
