import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated().isSuperadmin();

	try {
		await event.locals.db.sessions.deleteSessionById(event.params.sessionId);
		return new Response(null, { status: 204 });
	} catch {
		return error(500, "Error deleting session");
	}
};
