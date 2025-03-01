import { env } from "$env/dynamic/private";
import { DEMO_USER } from "$lib";
import { getCurrentFormattedDateTime } from "$lib/server";
import Labline from "$lib/server/api/Labline";
import * as auth from "$lib/server/auth";
import { User } from "$lib/server/db/entity";
import { Security } from "$lib/server/Security";
import { error, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const BYPASS_ACCOUNT_REQUIREMENT = env.BYPASS_ACCOUNT_REQUIREMENT === "true";
const REQUIRED_ENV_VARIABLES = [
	"DATABASE_URL",
	"OIDC_DISCOVERY_ENDPOINT",
	"OIDC_CLIENT_ID",
	"OIDC_CLIENT_SECRET",
	"ABSOLUTE_DIR_PATH",
];

const missingVars = [];
for (const envVar of REQUIRED_ENV_VARIABLES) {
	if (!env[envVar]) {
		missingVars.push(envVar);
	}
}
if (missingVars.length !== 0) {
	console.log(`${missingVars.join(", ")} must be set`);
	process.exit(1);
}

if (env.CREATE_ACCOUNT) {
	try {
		console.log("Creating user from CREATE_ACCOUNT...");
		const newUser = await User.createUser(
			env.CREATE_ACCOUNT,
			"Initial User",
			["admin", "superadmin"],
			true,
		);
		console.log(`Created user ${newUser.username}`);
	} catch (e) {
		if (e instanceof Error) {
			console.log("Error creating initial account: ", e.message);
		}
	}
}

const originalHandle: Handle = async ({ event, resolve }) => {
	if (BYPASS_ACCOUNT_REQUIREMENT && !event.locals.user) {
		event.locals.user = DEMO_USER;
	}

	event.locals.labline = new Labline();
	event.locals.security = new Security(event);

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
	try {
		const { session, user } = await auth.validateSessionToken(sessionToken, event);

		if (session) {
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			auth.deleteSessionTokenCookie(event);
		}

		event.locals.user = user;
		event.locals.session = session;

		return resolve(event);
	} catch (err) {
		const currentTime = getCurrentFormattedDateTime();
		if (err instanceof AggregateError) {
			console.error(`${currentTime} · ${event.getClientAddress()} · ${err.errors.join(", ")}`);
		}

		console.error(`${currentTime} · ${event.getClientAddress()} · ${err}`);

		return error(500, "Error connecting to database");
	}
};

export const handle = sequence(handleAuth, originalHandle);
