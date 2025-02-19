import { error, isHttpError } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import type { UserWithRoles } from "$lib/types/entity";

export const load = (async (event) => {
	try {
		const userRes = await event.fetch(`/api/users/${event.params.userId}`);
		const user = await userRes.json();

		if (!userRes.ok) {
			return error(userRes.status, user.message || "Error retrieving user");
		}

		return { editUser: user as UserWithRoles };
	} catch (err) {
		if (isHttpError(err) && err.body.message) {
			{
				return error(err.status, err.body.message);
			}
		}
		return error(500, "Fetch connection error");
	}
}) satisfies LayoutServerLoad;
