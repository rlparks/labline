import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
	const { buildingNumber } = params;

	const labRes = await fetch(`/api/labs/${buildingNumber}`);

	const labs = await labRes.json();

	if (!labRes.ok || !labs || labs.length === 0) {
		error(404, "Building not found or has no labs");
	}
	return { labs };
}) satisfies PageServerLoad;
