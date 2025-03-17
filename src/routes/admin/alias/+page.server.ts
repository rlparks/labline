import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isSuperadmin();
	return { pageTitle: "Building Aliases", pageDescription: "Manage Building Aliases for labline." };
}) satisfies PageServerLoad;
