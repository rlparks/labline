import { User } from "$lib/server/db/entity";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ROLES_LIST, type Role } from "$lib/types";

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
			const user = await User.createUser(reqJson.username, reqJson.name, reqJson.role || null);
			return json(user, { status: 201 });
		} catch (err) {
			if (err instanceof Error) {
				return error(400, err.message);
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
	role: Role | "";
};

function postUserIsValid(user: unknown): user is PostUser {
	return (
		typeof user === "object" &&
		user !== null &&
		"username" in user &&
		"name" in user &&
		"role" in user &&
		typeof user.username === "string" &&
		typeof user.name === "string" &&
		(ROLES_LIST.includes(user.role as Role) || user.role === "")
	);
}
