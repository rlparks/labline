import { User } from "$lib/server/db/repository";
import { error, isHttpError, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ROLES_LIST, type Role } from "$lib/types/entity";

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

	if (postUserIsValid(reqJson)) {
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

type PostUser = {
	username: string;
	name: string;
	roles: Role[];
};

function postUserIsValid(user: unknown): user is PostUser {
	let rolesAreValid = true;
	try {
		for (const role of (user as PostUser).roles) {
			if (!ROLES_LIST.includes(role)) {
				rolesAreValid = false;
				break;
			}
		}
	} catch {
		return false;
	}

	return (
		typeof user === "object" &&
		user !== null &&
		"username" in user &&
		"name" in user &&
		"roles" in user &&
		typeof user.username === "string" &&
		typeof user.name === "string" &&
		rolesAreValid
	);
}
