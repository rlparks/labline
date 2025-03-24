import type { BuildingWithAlias } from "$lib/types";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.isAuthenticated();

	try {
		const buildings = (await event.locals.labline.getBuildings()) as BuildingWithAlias[];
		const aliases = await event.locals.db.buildingAliases.getBuildingAliases();

		for (const alias of aliases) {
			const aliasedBuilding = buildings.find(
				(building) => building.number === alias.buildingNumber,
			);
			if (aliasedBuilding) {
				aliasedBuilding.alias = alias.alias;
			}
		}

		return json(buildings);
	} catch {
		return error(500, "Error: Error retrieving buildings");
	}
};
