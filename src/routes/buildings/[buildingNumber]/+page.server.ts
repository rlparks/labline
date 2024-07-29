import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
	const { buildingNumber } = params;

	const labRes = await fetch(`/api/labs/${buildingNumber}`);

	const labs = await labRes.json();

	if (!labRes.ok || !labs) {
		error(404, "Building not found");
	}
	return { labs };
}) satisfies PageServerLoad;
