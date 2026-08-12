import { isAddress } from "viem";
import { AuraApiError, getAuraStrategies } from "@/lib/aura/client";
import { DashboardWorkspace } from "@/components/dashboard-workspace";

type WorkspaceView = "overview" | "strategies" | "developer";

export async function DashboardRoute({ view, searchParams }: { view: WorkspaceView; searchParams: Promise<{ address?: string }> }) {
  const { address = "" } = await searchParams;
  let analysis = null;
  let error = "";

  if (address) {
    if (!isAddress(address)) error = "Enter a valid EVM wallet address.";
    else {
      try {
        analysis = await getAuraStrategies(address);
      } catch (caught) {
        error = caught instanceof AuraApiError ? caught.message : "AURA could not analyze this wallet.";
      }
    }
  }

  return <DashboardWorkspace key={`${view}-${address}`} view={view} analysis={analysis} initialAddress={address} initialError={error} />;
}
