import { NextRequest, NextResponse } from "next/server";
import { AuraApiError, getAuraStrategies } from "@/lib/aura/client";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")?.trim() ?? "";

  try {
    const analysis = await getAuraStrategies(address);
    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof AuraApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Unexpected error while contacting AURA." },
      { status: 502 },
    );
  }
}
