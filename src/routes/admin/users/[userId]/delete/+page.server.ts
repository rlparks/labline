import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isAuthenticated().isAdmin();
	const parentData = await event.parent();
	return {
		pageTitle: `Delete User · ${parentData.editUser.username}`,
		pageDescription: "Delete labline user.",
	};
}) satisfies PageServerLoad;
