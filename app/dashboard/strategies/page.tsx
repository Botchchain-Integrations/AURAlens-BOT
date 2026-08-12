import type { Metadata } from "next";
import { DashboardRoute } from "@/components/dashboard-route";

export const metadata: Metadata = {
  title: "Strategies | AuraLens",
  description: "Review AURA-powered wallet strategies and risk context.",
};

export default function StrategiesPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  return <DashboardRoute view="strategies" searchParams={searchParams} />;
}
