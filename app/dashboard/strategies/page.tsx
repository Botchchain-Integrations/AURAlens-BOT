import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardWorkspace } from "@/components/dashboard-workspace";

export const metadata: Metadata = {
  title: "Strategies | AuraLens",
  description: "Review AURA-powered wallet strategies and risk context.",
};

export default function StrategiesPage() {
  return <Suspense><DashboardWorkspace view="strategies" /></Suspense>;
}
