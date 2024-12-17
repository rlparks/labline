import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	// we don't need logged in users seeing the splash page
	// if they want to see it so badly, they can log out
	if (event.locals.user) {
		return redirect(303, "/buildings");
	}

	return {};
}) satisfies PageServerLoad;
