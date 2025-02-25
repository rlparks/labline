import { Session } from "$lib/server/db/repository";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isSuperadmin();

	const sessionCount = await Session.getSessionCountPerUser();

	return json(sessionCount);
};
