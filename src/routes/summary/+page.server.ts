import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Building, Lab } from "$lib/types";

export const load = (async ({ fetch }) => {
	const labsRes = await fetch("/api/labs");
	if (!labsRes.ok) {
		return error(500, "Error retrieving labs");
	}
	const labs = (await labsRes.json()) as Lab[];

	const buildingsRes = await fetch("/api/buildings");
	if (!buildingsRes.ok) {
		return error(500, "Error retrieving buildings");
	}
	const buildings = (await buildingsRes.json()) as Building[];

	return { labs, buildings };
}) satisfies PageServerLoad;
