import { User } from "$lib/server/db/entity";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();
	const user = await User.getUserById(event.params.userId);

	if (!user) {
		return error(404, "User not found");
	}

	return json(user);
};
