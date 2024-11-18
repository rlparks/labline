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
	const reqJson = (await event.request.json()) as {
		id: string;
		username: string;
		name: string;
		role: string;
	};

	try {
		const user = await User.updateUserById(event.params.userId, {
			id: reqJson.id,
			username: reqJson.username,
			name: reqJson.name,
			role: reqJson.role || null,
		});
		return json(user);
	} catch (err) {
		if (err instanceof Error) {
			return error(400, err.message);
		}
		return error(500, "Error updating user");
	}
};

export const DELETE: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	try {
		const user = await User.deleteUserById(event.params.userId);
		return json(user);
	} catch (err) {
		if (err instanceof Error) {
			return error(400, err.message);
		}
		return error(404, "Error deleting user");
	}
};
