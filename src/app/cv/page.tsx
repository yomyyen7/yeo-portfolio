import type { Metadata } from "next";
import Cv from "@/components/Cv";

export const metadata: Metadata = {
  title: "CV — Yomoyaha Yeo",
  description: "CV de Yomoyaha Yeo, développeur logiciel, Master 1 Cybersécurité et IA à l'ESATIC.",
};

export default function CvPage() {
  return <Cv />;
}
