import type { Metadata } from "next";
import Activity from "@/components/console/views/Activity";

export const metadata: Metadata = { title: "Activité" };

export default function Page() {
  return <Activity />;
}
