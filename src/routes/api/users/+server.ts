import { User } from "$db/repository";
import { postUserWithRolesIsValid } from "$lib/types/entity/guards";
import { error, isHttpError, json } from "@sveltejs/kit";
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

export const POST: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	const reqJson = await event.request.json();

	if (postUserWithRolesIsValid(reqJson)) {
		try {
			if (reqJson.roles.length !== 0) {
				event.locals.security.isSuperadmin();
			}
			const user = await User.createUser(reqJson.username, reqJson.name, reqJson.roles);
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
