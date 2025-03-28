import { logUserAction } from "$lib/server";
import { postUserWithRolesIsValid } from "$lib/types/entity/guards";
import { validateUserFields } from "$lib/types/entity/helpers";
import { error, isHttpError, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	try {
		const users = await event.locals.db.users.getUsers();
		return json(users);
	} catch {
		return error(500, "Error retrieving users");
	}
};

export const POST: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	const reqJson = await event.request.json();

	if (postUserWithRolesIsValid(reqJson)) {
		try {
			if (reqJson.roles.length !== 0) {
				event.locals.security.isSuperadmin();
			}

			// ensure username and name are valid
			validateUserFields(reqJson);

			const user = await event.locals.db.users.createUser({
				username: reqJson.username.trim(),
				name: reqJson.name.trim(),
				roles: reqJson.roles,
			});

			if (event.locals.user) {
				logUserAction(event.locals.user, `Created user ${user.username}`);
			}

			return json(user, { status: 201 });
		} catch (err) {
			if (err instanceof Error) {
				return error(400, err.message);
			}

			if (isHttpError(err)) {
				return error(err.status, err.body.message);
			}

			return error(500, "Error creating user");
		}
	} else {
		return error(400, "Invalid request");
	}
};
