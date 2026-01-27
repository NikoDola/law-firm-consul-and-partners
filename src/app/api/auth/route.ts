import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing GITHUB_CLIENT_ID" },
      { status: 500 }
    );
  }

  // Decap will open this endpoint in a popup window.
  // We redirect the user to GitHub OAuth, and GitHub redirects back to our callback.
  const redirectUri = `${url.origin}/api/auth/callback`;
  const state = url.searchParams.get("state"); // Decap may send a state param.

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo");
  if (state) authorizeUrl.searchParams.set("state", state);

  return NextResponse.redirect(
    authorizeUrl.toString()
  );
}
