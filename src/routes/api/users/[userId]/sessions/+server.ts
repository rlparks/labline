import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isSuperadmin();

	const sessions = await event.locals.db.sessions.getSafeSessionsByUserId(event.params.userId);

	return json(sessions);
};
