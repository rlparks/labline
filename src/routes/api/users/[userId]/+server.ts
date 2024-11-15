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
export const PUT: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();
	const reqJson = await event.request.json();

	return error(500, "Not implemented");
};

export const DELETE: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();
	const user = await User.deleteUserById(event.params.userId);
	return json(user);
};
