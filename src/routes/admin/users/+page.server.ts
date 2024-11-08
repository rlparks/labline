import type { UserWithRole } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isAuthenticated();
	event.locals.security.isAdmin();

	const usersRes = await event.fetch("/api/users");

	if (!usersRes.ok) {
		return error(usersRes.status, "Error retrieving users");
	}

	const users = (await usersRes.json()) as UserWithRole[];

	return { users };
}) satisfies PageServerLoad;
