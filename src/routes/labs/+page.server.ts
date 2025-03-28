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
		// just sending this 2.2k length array to the client takes 80ms of
		// the 140ms load time :)
		// could be optimized with a promise, but that wouldn't really
		// improve the UX as there is already a loading indicator on nav
		labs,
		pageTitle: "Search All Labs",
		pageDescription: "UGA Lab Emergency Contacts for All Labs.",
	};
}) satisfies PageServerLoad;
