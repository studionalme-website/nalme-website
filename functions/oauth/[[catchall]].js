/**
 * GitHub OAuth proxy for Decap CMS
 *
 * Decap CMS (at /admin/) authenticates Tejaswini against GitHub before letting
 * her edit content. Decap by default uses Netlify's hosted OAuth service.
 * Since we're on Cloudflare Pages, we provide our own OAuth proxy at these routes:
 *
 *   /oauth/auth      → kicks off the GitHub OAuth flow
 *   /oauth/callback  → GitHub redirects here with a code; we exchange for a token
 *                      and post it back to the Decap popup window via postMessage
 *
 * ─── ENVIRONMENT VARIABLES (Cloudflare Pages → Settings → Environment variables)
 *   GITHUB_CLIENT_ID      — from GitHub OAuth App
 *   GITHUB_CLIENT_SECRET  — from GitHub OAuth App (keep secret, not exposed to client)
 *
 * ─── GITHUB OAUTH APP SETUP (one-time, see CMS-SETUP.md)
 *   1. github.com → Settings → Developer settings → OAuth Apps → New
 *   2. Homepage URL: https://studionalme.com
 *   3. Authorization callback URL: https://studionalme.com/oauth/callback
 *   4. Copy Client ID and Client Secret into Cloudflare Pages env vars
 */

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url);
  const segments = params.catchall || [];
  const route = Array.isArray(segments) ? segments.join('/') : segments;

  // ─── Step 1 — Start the OAuth flow ──────────────────────────
  if (route === 'auth') {
    if (!env.GITHUB_CLIENT_ID) {
      return text('GITHUB_CLIENT_ID not configured', 500);
    }
    const state = crypto.randomUUID();
    const redirectTo = new URL('https://github.com/login/oauth/authorize');
    redirectTo.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    redirectTo.searchParams.set('scope', 'repo,user');
    redirectTo.searchParams.set('state', state);
    redirectTo.searchParams.set('redirect_uri', `${url.origin}/oauth/callback`);
    return Response.redirect(redirectTo.toString(), 302);
  }

  // ─── Step 2 — Handle the GitHub callback ────────────────────
  if (route === 'callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return text('Missing code parameter', 400);
    }
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return text('GitHub OAuth credentials not configured', 500);
    }

    // Exchange code for access token
    let token;
    try {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'studionalme-decap-oauth',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await tokenRes.json();
      if (data.error) {
        return text(`GitHub error: ${data.error_description || data.error}`, 400);
      }
      token = data.access_token;
    } catch (e) {
      return text(`Token exchange failed: ${e.message}`, 500);
    }

    if (!token) {
      return text('No access token returned by GitHub', 500);
    }

    // Post the token back to the Decap popup window and close it
    const payload = JSON.stringify({ token, provider: 'github' });
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Authenticated</title></head>
<body style="background:#fffaf0;font-family:system-ui;text-align:center;padding:6rem 2rem;">
  <p>Authentication complete. You can close this window.</p>
  <script>
    (function () {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:github:success:' + ${JSON.stringify(payload)},
          e.origin
        );
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script>
</body>
</html>`;
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return text('Not found', 404);
}

function text(body, status = 200) {
  return new Response(body, { status, headers: { 'Content-Type': 'text/plain' } });
}
