import { getLabData } from "$lib/server";
import type { Building } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	const labs = await getLabData();
	const buildings: Building[] = labs.map((lab) => ({
		name: lab["Bldg Name"],
		number: lab["Bldg Number"],
	}));

	const seenBuildingNumbers = new Set<string>();

	const uniqueBuildings = buildings.filter((building) => {
		if (seenBuildingNumbers.has(building.number) || !building.number) {
			return false;
		}
		seenBuildingNumbers.add(building.number);
		return true;
	});

	return json(uniqueBuildings);
};
