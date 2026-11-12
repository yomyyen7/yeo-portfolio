import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const serif = Newsreader({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "500"] });
const sans = IBM_Plex_Sans({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://yeo-portfolio-theta.vercel.app"),
  title: "Yomoyaha Yeo — Développeur logiciel",
  description:
    "Portfolio de Yomoyaha Yeo, développeur logiciel en Master 1 Cybersécurité et Intelligence Artificielle à l'ESATIC (Abidjan) : projets, parcours, compétences et contact.",
  openGraph: {
    title: "Yomoyaha Yeo — Développeur logiciel",
    description: "Développeur logiciel, spécialisé en cybersécurité et en intelligence artificielle.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
