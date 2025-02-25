import { env } from "$env/dynamic/private";
import { DEMO_USER, getCurrentFormattedDateTime } from "$lib";
import Labline from "$lib/server/api/Labline";
import * as auth from "$lib/server/auth";
import { RealUserRepository } from "$lib/server/db/repository/real/RealUserRepository";
import { RealUserService } from "$lib/server/db/service/real/RealUserService";
import { onServerStart } from "$lib/server/init";
import { Security } from "$lib/server/Security";
import { error, type Handle, type ServerInit } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const init: ServerInit = async () => {
	await onServerStart();

	const users = new RealUserService(new RealUserRepository());

	// console.log(await users.getUsersByRole("admin"));
	// console.log(await users.getUsers());
	// console.log(await users.getUserByUsername("rlparks"));
	// console.log(await users.getUserById("7zWi5CkMxlvePcuIJmfEO"));
	// console.log(await users.createUser({ username: "rlparks", name: "becc", roles: [] }));
	// console.log(await users.createUser({ username: "sdgsaadfadasf", name: "temst", roles: [] }));
	// console.log(
	// 	await users.updateUserById("7zWi5CkMxlvePcuIJmfEO", {
	// 		username: "rlparks",
	// 		name: "becc",
	// 	}),
	// );
};

const originalHandle: Handle = async ({ event, resolve }) => {
	const BYPASS_ACCOUNT_REQUIREMENT = env.BYPASS_ACCOUNT_REQUIREMENT === "true";
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
