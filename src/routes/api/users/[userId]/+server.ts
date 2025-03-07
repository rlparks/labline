import { logUserAction } from "$lib/server";
import { userWithRolesIsValid } from "$lib/types/entity/guards";
import { validateUserFields } from "$lib/types/entity/helpers";
import { error, isHttpError, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();
	const user = await event.locals.db.users.getUserById(event.params.userId);

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
	const reqJson = await event.request.json();

	if (!userWithRolesIsValid(reqJson)) {
		return error(400, "Invalid user");
	}

	try {
		const existingUser = await event.locals.db.users.getUserById(event.params.userId);
		if (existingUser?.roles.length !== 0 || reqJson.roles.length !== 0) {
			event.locals.security.isSuperadmin();
		}

		// ensure username and name are valid
		validateUserFields(reqJson);

		const user = await event.locals.db.users.updateUserWithRolesById(event.params.userId, {
			username: reqJson.username,
			name: reqJson.name,
			roles: reqJson.roles,
		});

		if (event.locals.user) {
			logUserAction(event.locals.user, `Updated user ${existingUser?.username}`);
		}

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
		const existingUser = await event.locals.db.users.getUserById(event.params.userId);
		if (existingUser?.roles.length !== 0) {
			event.locals.security.isSuperadmin();
		}

		const user = await event.locals.db.users.deleteUserById(event.params.userId);

		if (event.locals.user) {
			logUserAction(event.locals.user, `Deleted user ${existingUser?.username}`);
		}

		return json(user);
	} catch (err) {
		if (err instanceof Error) {
			return error(400, err.message);
		}
		return error(404, "Error deleting user");
	}
};
