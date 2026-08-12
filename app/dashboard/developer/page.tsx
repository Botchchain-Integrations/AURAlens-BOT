import type { Metadata } from "next";
import { DashboardRoute } from "@/components/dashboard-route";

export const metadata: Metadata = {
  title: "Developer Integration | AuraLens",
  description: "See how AuraLens turns AURA wallet intelligence into application-specific product experiences.",
};

export default function DeveloperPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  return <DashboardRoute view="developer" searchParams={searchParams} />;
}
