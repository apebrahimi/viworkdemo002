Cursor Brief — “Super-Simple Admin Login (Local-Only)”

Goal
Create a separate admin login that protects /admin/* with a plain username+password stored in env.
No DB. No MFA. No changes to existing user auth or APIs. Must not break current platform.

Key rules
	•	Touch only /admin/* UI and new /api/admin/* handlers inside the web app.
	•	Do not modify existing user login, tokens, or backend services.
	•	No new dependencies unless absolutely necessary (prefer Node/Next built-ins).
	•	Keep everything additive and reversible.

⸻

1) Environment variables (server only)

Add to .env / secret store:

ADMIN_USERNAME=changeme
ADMIN_PASSWORD=changeme
ADMIN_SESSION_TTL_SECONDS=28800   # 8h, keep simple

Use plain values (no hashing) for now—this lives on the local network only.

⸻

2) Minimal API routes (Next.js route handlers)

Create:
	•	src/app/api/admin/login/route.ts (POST)
	•	Read JSON { username, password }.
	•	Compare to process.env.ADMIN_USERNAME/ADMIN_PASSWORD.
	•	On success, set cookie viw_admin_sess=1 with:
	•	HttpOnly: true
	•	Path: /admin
	•	Max-Age: ADMIN_SESSION_TTL_SECONDS
	•	SameSite: "Lax"
	•	Secure: process.env.NODE_ENV === "production"
	•	Return 200 { ok: true }; on fail 401 { ok: false, error: "Invalid" }.
	•	src/app/api/admin/logout/route.ts (POST)
	•	Clear viw_admin_sess (set Max-Age=0, same flags).
	•	Return 200 { ok: true }.
	•	src/app/api/admin/me/route.ts (GET)
	•	If cookie present → 200 { authenticated: true } else 401.

No DB calls. No imports from user auth. Keep logic self-contained.

⸻

3) Middleware to guard /admin/*

Create/modify src/middleware.ts:
	•	For requests matching /admin/:path*
	•	Allow /admin/login and static assets.
	•	If cookie viw_admin_sess absent → redirect to /admin/login.
	•	Otherwise continue.
	•	Do not affect /api/* except /api/admin/* (which should work regardless).
	•	Export config.matcher = ["/admin/:path*"].

Use Next’s cookies()/RequestCookies in middleware (Edge-safe). No external libs.

⸻

4) Minimal pages
	•	src/app/admin/login/page.tsx
	•	Simple form (username, password).
	•	On submit: fetch("/api/admin/login", { method: "POST", body: JSON.stringify(...), headers: {"Content-Type":"application/json"} }).
	•	On 200 → router.replace("/admin"); on 401 show “Invalid credentials”.
	•	No client-side storage of auth (no localStorage/sessionStorage).
	•	Existing src/app/admin/page.tsx (your dashboard) should now be reachable only after login.
	•	Optional small header on admin pages with a “Logout” button → POST /api/admin/logout, then router.replace("/admin/login").

⸻

5) Nginx / Docker
	•	No changes needed if /admin/* already proxies to the web app.
	•	If you have path-specific proxying, ensure:
	•	location ^~ /admin/ { proxy_pass http://web:3000; }
	•	Do not add or modify user-auth routes.

⸻

6) Testing / acceptance (must pass)
	1.	Isolation

	•	/login (end-user) and all user APIs behave exactly as before.

	2.	Access control

	•	Visit /admin → redirected to /admin/login.
	•	Correct admin creds → enter /admin.
	•	Wrong creds → stay on /admin/login with error.
	•	Refresh /admin → still in (cookie present).
	•	POST /api/admin/me returns 200 when logged in, 401 otherwise.

	3.	Cookie behavior

	•	Cookie name: viw_admin_sess
	•	Scope: Path=/admin
	•	Flags: HttpOnly, SameSite=Lax, Secure only in prod.

	4.	Logout

	•	POST /api/admin/logout clears cookie; /admin redirects back to /admin/login.

	5.	No regressions

	•	Build, lint, type-check, and container start succeed with zero new warnings.
	•	No changes to database, migrations, or user auth code.

⸻

7) Rollback plan
	•	Delete src/app/api/admin/* handlers.
	•	Remove admin middleware block & login page.
	•	No data or config rollback required.

⸻

8) Notes for Cursor (pitfalls to avoid)
	•	Do not import any existing user-auth utilities/hooks/contexts.
	•	Do not add auth headers to non-admin fetches.
	•	Keep the cookie server-set only (HttpOnly) and never read it in client JS.
	•	Keep the implementation in one PR touching only the files listed above.
