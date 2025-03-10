import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch, locals }) => {
	locals.security.isAuthenticated();

	const labRes = await fetch(`/api/labs`);
	if (!labRes.ok) {
		return error(500, "Error retrieving labs");
	}

	const labs = await labRes.json();

	if (!labs || labs.length === 0) {
		return error(404, "No labs found");
	}

	return {
		labs,
		pageTitle: "Search All Labs",
		pageDescription: "UGA Lab Emergency Contacts for All Labs.",
	};
}) satisfies PageServerLoad;
