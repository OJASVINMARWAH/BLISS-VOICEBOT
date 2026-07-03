import { NextRequest, NextResponse } from "next/server";

/**
 * Validates the BLISS_API_KEY header on public v1 routes.
 * Set BLISS_API_KEY in your .env.local / Vercel env vars.
 * Teammates call every endpoint with:  Authorization: Bearer <BLISS_API_KEY>
 */
export function checkApiKey(req: NextRequest): NextResponse | null {
  const expected = process.env.BLISS_API_KEY;
  if (!expected) return null; // key not set → open (dev mode)

  const auth = req.headers.get("authorization") ?? "";
  const key  = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (key !== expected) {
    return NextResponse.json(
      { error: "Unauthorized. Pass your API key as: Authorization: Bearer <BLISS_API_KEY>" },
      { status: 401, headers: { "WWW-Authenticate": 'Bearer realm="BLISS API"' } }
    );
  }
  return null; // ok
}

/** Standard CORS headers so the widget JS can call from any origin */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
