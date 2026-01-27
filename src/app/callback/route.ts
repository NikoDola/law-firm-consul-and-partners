import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Delegate to the same logic as `/api/auth/callback` so Decap can use the conventional `/callback` URL.
  const url = new URL(request.url);
  url.pathname = "/api/auth/callback";
  return NextResponse.redirect(url.toString());
}

