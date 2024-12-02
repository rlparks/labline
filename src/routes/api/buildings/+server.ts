import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated();

	try {
		const buildings = await event.locals.labline.getBuildings();
		return json(buildings);
	} catch {
		return error(500, "Error: Error retrieving buildings");
	}
};
