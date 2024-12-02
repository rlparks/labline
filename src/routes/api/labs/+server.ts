import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated();

	try {
		const labs = await event.locals.labline.getLabs();
		return json(labs);
	} catch {
		return error(500, "Error retrieving labs");
	}
};
