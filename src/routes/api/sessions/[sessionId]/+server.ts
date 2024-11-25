import { Session } from "$lib/server/db/entity";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	try {
		await Session.deleteSessionById(event.params.sessionId);
		return new Response(null, { status: 204 });
	} catch {
		return error(500, "Error deleting session");
	}
};
