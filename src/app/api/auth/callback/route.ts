import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? undefined;

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing GITHUB_CLIENT_ID" },
      { status: 500 }
    );
  }

  if (!clientSecret) {
    return NextResponse.json(
      { error: "Missing GITHUB_CLIENT_SECRET" },
      { status: 500 }
    );
  }

  if (!code) {
    return NextResponse.json({ error: "Missing OAuth code" }, { status: 400 });
  }

  // Exchange code for an access token.
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenJson: {
    access_token?: string;
    token_type?: string;
    scope?: string;
    error?: string;
    error_description?: string;
  } = await tokenRes.json();

  if (!tokenRes.ok || tokenJson.error || !tokenJson.access_token) {
    return NextResponse.json(
      {
        error: "OAuth token exchange failed",
        details: tokenJson.error_description ?? tokenJson.error ?? tokenJson,
      },
      { status: 500 }
    );
  }

  // Decap expects the token in the URL hash.
  const adminRedirect = new URL(`${url.origin}/admin/`);
  const hashParams = new URLSearchParams();
  hashParams.set("access_token", tokenJson.access_token);
  hashParams.set("token_type", tokenJson.token_type ?? "bearer");
  if (state) hashParams.set("state", state);
  adminRedirect.hash = hashParams.toString();

  return NextResponse.redirect(adminRedirect.toString());
}

