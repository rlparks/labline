import type { UserWithRoles } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	const usersRes = await event.fetch("/api/users");

	if (!usersRes.ok) {
		return error(usersRes.status, "Error retrieving users");
	}

	const users = (await usersRes.json()) as UserWithRoles[];

	if (event.locals.user?.roles.includes("superadmin")) {
		const sessionCountRes = await event.fetch("/api/sessions");

		if (!sessionCountRes.ok) {
			return error(sessionCountRes.status, "Error retrieving session count");
		}

		const sessionCountJson = (await sessionCountRes.json()) as {
			userId: string;
			sessionsCount: number;
		}[];

		const sessionCount = mapSessionCount(sessionCountJson);

		return { users, sessionCount };
	} else {
		return { users };
	}
}) satisfies PageServerLoad;

/**
 * Converts the session count of format
 * [{ userId: string, sessionsCount: number }]
 * to a Map that is faster to access while rendering.
 *
 * @param sessionCount
 * @returns
 */
function mapSessionCount(sessionCount: { userId: string; sessionsCount: number }[]) {
	const map = new Map<string, number>();
	for (const session of sessionCount) {
		map.set(session.userId, session.sessionsCount);
	}

	return map;
}
