import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Case from "@/components/console/views/Case";
import { getContent, projectIds } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return projectIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getContent("fr").projects.find((x) => x.id === id);
  return p ? { title: `${p.code} · ${p.name}`, description: p.summary } : {};
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!projectIds.includes(id)) notFound();
  return <Case id={id} />;
}
