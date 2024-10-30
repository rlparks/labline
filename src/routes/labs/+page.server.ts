import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Lab } from "$lib/types";

export const load = (async ({ fetch }) => {
	async function fetchLabs() {
		const labRes = await fetch(`/api/labs`);
		if (!labRes.ok) {
			return error(500, "Error retrieving labs");
		}

		const labs = (await labRes.json()) as Lab[];

		if (!labs || labs.length === 0) {
			return error(404, "No labs found");
		}

		return labs;
	}

	return { labs: fetchLabs() };
}) satisfies PageServerLoad;
