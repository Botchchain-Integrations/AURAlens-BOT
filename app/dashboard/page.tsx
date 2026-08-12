import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardWorkspace } from "@/components/dashboard-workspace";

export const metadata: Metadata = {
  title: "Workspace | AuraLens",
  description: "Analyze wallet context and AURA-powered strategies.",
};

export default function DashboardPage() {
  return <Suspense><DashboardWorkspace view="overview" /></Suspense>;
}
