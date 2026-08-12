import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardWorkspace } from "@/components/dashboard-workspace";

export const metadata: Metadata = {
  title: "Developer View | AuraLens",
  description: "Inspect the AURA request and normalized wallet intelligence.",
};

export default function DeveloperPage() {
  return <Suspense><DashboardWorkspace view="developer" /></Suspense>;
}
