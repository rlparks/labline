import { env } from "$env/dynamic/private";
import { NODE_ENV } from "$env/static/private";
import { makeUserSafe } from "$lib/server";
import type { RawUser } from "$lib/types";
import { error, json, redirect, type Handle } from "@sveltejs/kit";
import PocketBase from "pocketbase";

const UNSECURE_PAGE_ROUTES = ["/", "/login/callback"];
const UNSECURE_API_ROUTES = ["/api/auth/methods", "/api/auth/login/oidc"];

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
		event.locals.user = undefined;
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

	const result = await resolve(event);

	result.headers.append(
		"set-cookie",
		event.locals.pb.authStore.exportToCookie({ secure: NODE_ENV === "production" }),
	);

	return result;
};
