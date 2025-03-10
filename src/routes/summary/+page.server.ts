import type { Building, Lab } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals }) => {
	locals.security.isAuthenticated();

	const labsPromise = fetch("/api/labs");
	const buildingsPromise = fetch("/api/buildings");
	const [labsRes, buildingsRes] = await Promise.all([labsPromise, buildingsPromise]);

	if (!labsRes.ok) {
		return error(500, "Error retrieving labs");
	}
	const labs = (await labsRes.json()) as Lab[];

	if (!buildingsRes.ok) {
		return error(500, "Error retrieving buildings");
	}
	const buildings = (await buildingsRes.json()) as Building[];

	return { labs, buildings, pageTitle: "Summary", pageDescription: "UGA Lab Summary Stats." };
}) satisfies PageServerLoad;
