import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch, locals }) => {
	locals.security.isAuthenticated();

	const { buildingNumber } = params;

	const labRes = await fetch(`/api/labs/${buildingNumber}`);

	if (!labRes.ok) {
		return error(500, "Error retrieving labs");
	}

	const labs = await labRes.json();
	if (!labs || labs.length === 0) {
		return error(404, "Building not found");
	}

	const alias = await locals.db.buildingAliases.getBuildingAliasByBuildingNumber(buildingNumber);

	const pageTitle = labs[0] ? `${labs[0]["Bldg Number"]} · ${labs[0]["Bldg Name"]}` : "building";
	return {
		labs,
		pageTitle,
		pageDescription: `UGA Lab Emergency Contacts for ${pageTitle}`,
		alias,
	};
}) satisfies PageServerLoad;
