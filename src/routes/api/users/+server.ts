import { User } from "$lib/server/db/entity";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated();
	event.locals.security.isAdmin();

	const users = await User.getUsers();
	return json(users);
};
