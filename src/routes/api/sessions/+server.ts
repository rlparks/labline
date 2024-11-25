import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Session } from "$lib/server/db/entity";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	const sessionCount = await Session.getSessionCountPerUser();

	return json(sessionCount);
};
