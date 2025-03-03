import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isSuperadmin();

	const sessionCount = await event.locals.db.sessions.getSessionCountPerUser();

	return json(sessionCount);
};
