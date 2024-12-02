import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated();

	const { buildingNumber } = event.params;
	try {
		const labs = await event.locals.labline.getBuildingLabs(buildingNumber);

		return json(labs);
	} catch {
		return error(500, "Error retrieving labs");
	}
};
