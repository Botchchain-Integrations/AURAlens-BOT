import type { Metadata } from "next";
import { AuraDashboard } from "@/components/aura-dashboard";

export const metadata: Metadata = {
  title: "Workspace | AuraLens",
  description: "Analyze wallet context and AURA-powered strategies.",
};

export default function DashboardPage() {
  return <AuraDashboard />;
}
