import { getLabData } from "$lib/server";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
	const { buildingNumber } = params;
	try {
		const labs = await getLabData();

		const buildingLabs = labs.filter((lab) => lab["Bldg Number"] === buildingNumber);

		return json(buildingLabs);
	} catch {
		return error(500, "Error retrieving labs");
	}
};
