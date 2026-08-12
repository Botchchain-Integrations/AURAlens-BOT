import type { Metadata } from "next";
import { DashboardRoute } from "@/components/dashboard-route";

export const metadata: Metadata = {
  title: "Workspace | AuraLens",
  description: "Analyze wallet context and AURA-powered strategies.",
};

export default function DashboardPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  return <DashboardRoute view="overview" searchParams={searchParams} />;
}
