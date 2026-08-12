import type { Metadata } from "next";
import { DashboardRoute } from "@/components/dashboard-route";

export const metadata: Metadata = {
  title: "Developer View | AuraLens",
  description: "Inspect the AURA request and normalized wallet intelligence.",
};

export default function DeveloperPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  return <DashboardRoute view="developer" searchParams={searchParams} />;
}
