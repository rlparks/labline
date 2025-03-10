import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	// we don't need logged in users seeing the splash page
	// if they want to see it so badly, they can log out
	if (event.locals.user) {
		return redirect(303, "/buildings");
	}

	// UGA SSO redirects with a query parameter on logout
	// https://labline.uga.edu/?client_id=e
	// this removes query params from the root route
	// for a nicer look
	if (event.url.searchParams.size !== 0) {
		return redirect(303, "/");
	}

	return {
		pageTitle: "",
		pageDescription: "Access UGA Lab Emergency Contacts.",
	};
}) satisfies PageServerLoad;
