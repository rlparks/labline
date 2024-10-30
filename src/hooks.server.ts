import { env } from "$env/dynamic/private";
import { DEMO_USER } from "$lib";
import { makeUserSafe } from "$lib/server";
import Knowledger from "$lib/server/api/Knowledger";
import type { RawUser } from "$lib/types";
import { error, json, redirect, type Handle } from "@sveltejs/kit";
import PocketBase from "pocketbase";

const UNSECURE_PAGE_ROUTES = ["/", "/login/callback"];
const UNSECURE_API_ROUTES = ["/api/auth/methods", "/api/auth/login/oidc"];

const BYPASS_ACCOUNT_REQUIREMENT = env.BYPASS_ACCOUNT_REQUIREMENT === "true";

if (!env.PB_URL || !env.PB_ADMIN_EMAIL || !env.PB_ADMIN_PASSWORD) {
	console.log("PB_URL, PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set");
	process.exit(1);
}

try {
	const adminPb = new PocketBase(env.PB_URL);
	await adminPb.admins.create({
		email: env.PB_ADMIN_EMAIL,
		password: env.PB_ADMIN_PASSWORD,
		passwordConfirm: env.PB_ADMIN_PASSWORD,
	});

	const pbWebUrl = `${env.PB_URL}/_`;
	console.log(`PB admin created! Please log in to ${pbWebUrl} and add your OIDC provider.`);
} catch {
	console.log("PB admin already exists");
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(env.PB_URL);
	try {
		await event.locals.pb.health.check();
	} catch (err) {
		console.log(err);
		return error(500, "Error: Unable to access the database.");
	}

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = makeUserSafe(event.locals.pb.authStore.model as RawUser);
	} else {
		if (!BYPASS_ACCOUNT_REQUIREMENT) {
			event.locals.user = undefined;
		} else {
			event.locals.user = DEMO_USER;
		}
	}

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

	result.headers.append("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: true }));

	// https://developer.mozilla.org/en-US/observatory suggestions
	result.headers.set("referrer-policy", "strict-origin-when-cross-origin");
	result.headers.set("x-content-type-options", "nosniff");
	result.headers.set("x-frame-options", "DENY");
	result.headers.set("cross-origin-resource-policy", "same-origin");
	result.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");

	return result;
};
