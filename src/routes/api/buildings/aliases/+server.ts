import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();
	const aliases = await event.locals.db.buildingAliases.getBuildingAliases();
	return json(aliases);
};
