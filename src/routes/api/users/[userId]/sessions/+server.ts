import { Session } from "$lib/server/db/repository";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isSuperadmin();

	const sessions = await Session.getSessionsByUserId(event.params.userId);

	return json(sessions);
};
