import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { SafeSession } from "$lib/types";

export const load = (async (event) => {
	event.locals.security.isAuthenticated().isSuperadmin();

	const userSessionsRes = await event.fetch(`/api/users/${event.params.userId}/sessions`);

	if (!userSessionsRes.ok) {
		return error(userSessionsRes.status, "Error retrieving user sessions");
	}

	const userSessions = (await userSessionsRes.json()) as SafeSession[];

	if (!event.locals.session) {
		return error(401, "somehow here with no session");
	}

	return { userSessions, currentUserSessionId: event.locals.session.id };
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete: async (event) => {
		const formData = await event.request.formData();
		const userId = event.params.userId;

		const sessionId = formData.get("sessionId");

		if (!sessionId) {
			return error(400, "Missing sessionId");
		}

		const sessionEndpoint = `/api/sessions/${sessionId}`;

		const delRes = await event.fetch(sessionEndpoint, {
			method: "DELETE",
		});

		if (!delRes.ok) {
			return error(delRes.status, "Error deleting session");
		}

		return redirect(303, `/admin/users/${userId}/sessions`);
	},
};
