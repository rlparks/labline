import { getLabData } from "$lib/server";
import type { Building } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	if (!locals.user) {
		return error(401, "Unauthorized");
	}

	try {
		const labs = await getLabData();
		const buildings: Building[] = labs.map((lab) => ({
			name: lab["Bldg Name"],
			number: lab["Bldg Number"],
		}));

		const seenBuildingNumbers = new Set<number>();
		const uniqueBuildings = buildings.filter((building) => {
			if (seenBuildingNumbers.has(building.number)) {
				return false;
			}
			seenBuildingNumbers.add(building.number);
			return true;
		});
		return { buildings: uniqueBuildings };
	} catch (err) {
		console.log(err);
	}
	return { buildings: [] };
}) satisfies PageServerLoad;
