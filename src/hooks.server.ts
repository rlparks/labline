import { env } from "$env/dynamic/private";
import { NODE_ENV } from "$env/static/private";
import type { SafeUser } from "$lib/types";
import { error, redirect, type Handle } from "@sveltejs/kit";
import PocketBase from "pocketbase";

const ALLOWED_ROUTES = ["/", "/api/auth/methods", "/login/callback", "/api/auth/login/oidc"];

if (!env.PB_URL || !env.PB_ADMIN_EMAIL || !env.PB_ADMIN_PASSWORD) {
	console.log("PB_URL, PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set");
	process.exit(1);
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
		event.locals.user = event.locals.pb.authStore.model as SafeUser;
	} else {
		event.locals.user = undefined;
	}

	// Redirect to home page (and get 401) if not allowed
	// if (!event.locals.user && event.route.id && !ALLOWED_ROUTES.includes(event.route.id)) {
	// 	return redirect(303, "/");
	// }

	const result = await resolve(event);

	result.headers.append(
		"set-cookie",
		event.locals.pb.authStore.exportToCookie({ secure: NODE_ENV === "production" }),
	);

	return result;
};
