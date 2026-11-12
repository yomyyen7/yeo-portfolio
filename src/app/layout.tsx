import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({ variable: "--font-ui", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yomoyaha Yeo — Software Developer",
  description:
    "Portfolio de Yomoyaha Yeo, développeur logiciel et étudiant en Master 1 Cybersécurité & IA : un bureau interactif avec terminal, assistant IA vocal, projets et scènes 3D.",
  openGraph: {
    title: "Yomoyaha Yeo — Software Developer",
    description: "Un portfolio en forme de système d'exploitation : terminal, assistant IA, projets et 3D.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
