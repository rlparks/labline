import { error, isHttpError } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { UserWithRole } from "$lib/types";

export const load = (async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	try {
		const userRes = await event.fetch(`/api/users/${event.params.userId}`);
		const user = await userRes.json();

		if (!userRes.ok) {
			return error(userRes.status, user.message || "Error retrieving user");
		}

		return { editUser: user as UserWithRole };
	} catch (err) {
		if (isHttpError(err) && err.body.message) {
			{
				return error(err.status, err.body.message);
			}
		}
		return error(500, "Fetch connection error");
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	edit: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const name = formData.get("name");
		const role = formData.get("role");
	},
	delete: async (event) => {},
};
