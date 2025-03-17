import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isSuperadmin();
	const buildingNumber = event.params.buildingNumber;

	const alias =
		await event.locals.db.buildingAliases.getBuildingAliasByBuildingNumber(buildingNumber);
	return json(alias);
};
