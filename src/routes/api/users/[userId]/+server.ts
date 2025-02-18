import { User } from "$lib/server/db/repository";
import { error, isHttpError, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();
	const user = await User.getUserById(event.params.userId);

	// require being superadmin to touch accounts with roles
	if (user?.roles.length !== 0) {
		event.locals.security.isSuperadmin();
	}

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
		roles: string[];
	};

	try {
		const existingUser = await User.getUserById(event.params.userId);
		if (existingUser?.roles.length !== 0 || reqJson.roles.length !== 0) {
			event.locals.security.isSuperadmin();
		}

		const user = await User.updateUserById(event.params.userId, {
			id: reqJson.id,
			username: reqJson.username,
			name: reqJson.name,
			roles: reqJson.roles,
		});
		return json(user);
	} catch (err) {
		if (err instanceof Error) {
			return error(400, err.message);
		}

		if (isHttpError(err)) {
			return error(err.status, err.body.message);
		}

		return error(500, "Error updating user");
	}
};

export const DELETE: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	try {
		const existingUser = await User.getUserById(event.params.userId);
		if (existingUser?.roles.length !== 0) {
			event.locals.security.isSuperadmin();
		}

		const user = await User.deleteUserById(event.params.userId);
		return json(user);
	} catch (err) {
		if (err instanceof Error) {
			return error(400, err.message);
		}
		return error(404, "Error deleting user");
	}
};
