import { getLabData } from "$lib/server";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
	const { buildingNumber } = params;
	const labs = await getLabData();

	const buildingLabs = labs.filter((lab) => lab["Bldg Number"] === buildingNumber);

	return json(buildingLabs);
};
