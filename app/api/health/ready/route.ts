import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Static public content has no mandatory remote dependency. Email and AI are optional
// route capabilities; this endpoint deliberately does not certify their availability.
export async function GET() {
  return NextResponse.json({ status: "ready", scope: "public-content" }, { headers: { "Cache-Control": "no-store" } });
}
