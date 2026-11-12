import type { Metadata } from "next";
import Skills from "@/components/console/views/Skills";

export const metadata: Metadata = { title: "Compétences" };

export default function Page() {
  return <Skills />;
}
