import type { Metadata } from "next";
import Cases from "@/components/console/views/Cases";

export const metadata: Metadata = { title: "Dossiers" };

export default function Page() {
  return <Cases />;
}
