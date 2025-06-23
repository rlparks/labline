import { dev } from "$app/environment";
import ServiceAggregator from "$db/service/ServiceAggregator";
import { env } from "$env/dynamic/private";
import { DEMO_USER, getCurrentFormattedDateTime } from "$lib";
import Labline from "$lib/server/api/Labline";
import Auth from "$lib/server/auth/Auth";
import { Security } from "$lib/server/auth/Security";
import { onServerStart } from "$lib/server/init";
import { error, type Handle, type ServerInit } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const init: ServerInit = async () => {
	await onServerStart(new ServiceAggregator());
};

const handleAuth: Handle = async ({ event, resolve }) => {
	event.locals.db = new ServiceAggregator();
	event.locals.auth = new Auth(event);

	const sessionToken = event.cookies.get(event.locals.auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	try {
		const { session, user } = await event.locals.auth.validateSessionToken(sessionToken);

		if (session) {
			event.locals.auth.setSessionTokenCookie(sessionToken, session.expiresAt);
		} else {
			event.locals.auth.deleteSessionTokenCookie();
		}

		event.locals.user = user;
		event.locals.session = session;

		return resolve(event);
	} catch (err) {
		const currentTime = getCurrentFormattedDateTime();
		if (err instanceof AggregateError) {
			console.error(`${currentTime} · ${event.getClientAddress()} · ${err.errors.join(", ")}`);
		} else {
			console.error(`${currentTime} · ${event.getClientAddress()} · ${err}`);
		}

		return error(500, "Error connecting to database");
	}
};

const setLocals: Handle = async ({ event, resolve }) => {
	const BYPASS_ACCOUNT_REQUIREMENT = env.BYPASS_ACCOUNT_REQUIREMENT === "true";
	if (BYPASS_ACCOUNT_REQUIREMENT && !event.locals.user) {
		event.locals.user = DEMO_USER;
	}

	event.locals.labline = new Labline();
	event.locals.security = new Security(event);

	const start = performance.now();

	const result = await resolve(event);

	if (dev && !event.isSubRequest) {
		console.log(
			`${event.request.method} ${event.url.pathname}: ${(performance.now() - start).toFixed(2)}ms`,
		);
	}

	// https://developer.mozilla.org/en-US/observatory suggestions
	result.headers.set("referrer-policy", "strict-origin-when-cross-origin");
	result.headers.set("x-content-type-options", "nosniff");
	result.headers.set("x-frame-options", "DENY");
	result.headers.set("cross-origin-resource-policy", "same-origin");
	result.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");

	return result;
};

export const handle = sequence(handleAuth, setLocals);
