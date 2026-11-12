import type { Metadata } from "next";
import Timeline from "@/components/console/views/Timeline";

export const metadata: Metadata = { title: "Chronologie" };

export default function Page() {
  return <Timeline />;
}
