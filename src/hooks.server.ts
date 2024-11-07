import { env } from "$env/dynamic/private";
import Knowledger from "$lib/server/api/Knowledger";
import * as auth from "$lib/server/auth.js";
import { json, redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const UNSECURE_PAGE_ROUTES = ["/", "/login/callback"];
const UNSECURE_API_ROUTES = ["/api/auth/login/oidc"];

const BYPASS_ACCOUNT_REQUIREMENT = env.BYPASS_ACCOUNT_REQUIREMENT === "true";
const REQUIRED_ENV_VARIABLES = [
	"DATABASE_URL",
	"OIDC_DISCOVERY_ENDPOINT",
	"OIDC_CLIENT_ID",
	"OIDC_CLIENT_SECRET",
	"ABSOLUTE_DIR_PATH",
];

for (const envVar of REQUIRED_ENV_VARIABLES) {
	if (!env[envVar]) {
		console.log(`${envVar} must be set`);
		process.exit(1);
	}
}

const originalHandle: Handle = async ({ event, resolve }) => {
	if (event.route.id && !event.locals.user) {
		if (!event.route.id.startsWith("/api")) {
			if (!UNSECURE_PAGE_ROUTES.includes(event.route.id)) {
				// Redirect to home page (and get 401) if not allowed
				return redirect(303, "/");
			}
		} else {
			// API route
			if (!UNSECURE_API_ROUTES.includes(event.route.id)) {
				return json({ error: "Unauthorized" }, { status: 401 });
			}
		}
	}

	event.locals.knowledger = new Knowledger();

	const result = await resolve(event);

	// https://developer.mozilla.org/en-US/observatory suggestions
	result.headers.set("referrer-policy", "strict-origin-when-cross-origin");
	result.headers.set("x-content-type-options", "nosniff");
	result.headers.set("x-frame-options", "DENY");
	result.headers.set("cross-origin-resource-policy", "same-origin");
	result.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");

	return result;
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const { session, user } = await auth.validateSessionToken(sessionToken, event);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle = sequence(handleAuth, originalHandle);
