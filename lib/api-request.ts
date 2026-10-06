import { NextResponse } from "next/server";
import { z } from "zod";

export class PublicRequestError extends Error {
  constructor(readonly status: 400 | 413, message: string) {
    super(message);
    this.name = "PublicRequestError";
  }
}

export async function readPublicJson(request: Request, maxBytes = 32 * 1024): Promise<unknown> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > maxBytes) throw new PublicRequestError(413, "Request body is too large.");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBytes) throw new PublicRequestError(413, "Request body is too large.");
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new PublicRequestError(400, "Invalid request body.");
  }
}

export function publicValidationError(error: unknown) {
  if (error instanceof PublicRequestError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid request data." }, { status: 400 });
  return null;
}
