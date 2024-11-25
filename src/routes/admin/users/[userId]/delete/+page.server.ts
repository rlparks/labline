import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isAuthenticated().isAdmin();
	return {};
}) satisfies PageServerLoad;
