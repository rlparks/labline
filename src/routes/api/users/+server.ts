import { User } from "$lib/server/db/entity";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	try {
		const users = await User.getUsers();
		return json(users);
	} catch {
		return error(500, "Error retrieving users");
	}
};
