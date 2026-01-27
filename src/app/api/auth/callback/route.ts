import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? undefined;
  const origin = url.origin;

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
    // Users sometimes hit this URL directly; Decap expects a popup callback page.
    return new NextResponse(
      `<!doctype html><html><body><pre>Missing OAuth code. Please start login from /admin and complete the GitHub authorization.</pre></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
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

  // Decap expects the OAuth provider callback page to `postMessage` the token to the opener.
  // This is the de-facto Netlify/Decap convention:
  //   authorization:{provider}:{status}:{json}
  const provider = "github";
  const payload = {
    token: tokenJson.access_token,
    provider,
    token_type: tokenJson.token_type ?? "bearer",
    state,
  };
  const successMessage = `authorization:${provider}:success:${JSON.stringify(
    payload
  )}`;
  const html = `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        try {
          if (window.opener) {
            window.opener.postMessage(${JSON.stringify(
              successMessage
            )}, ${JSON.stringify(origin)});
          }
        } finally {
          window.close();
        }
      })();
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

