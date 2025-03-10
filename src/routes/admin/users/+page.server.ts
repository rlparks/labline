import type { UserWithRoles } from "$lib/types/entity";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const titleData = {
	pageTitle: "Users",
	pageDescription: "User Management admin page for labline.",
};

export const load = (async (event) => {
	event.locals.security.isAuthenticated().isAdmin();

	const shouldGetSessionCount = event.locals.user?.roles.includes("superadmin");

	const usersPromise = event.fetch("/api/users");
	const sessionCountPromise = shouldGetSessionCount ? event.fetch("/api/sessions") : undefined;

	const [usersRes, sessionCountRes] = await Promise.all([usersPromise, sessionCountPromise]);

	if (!usersRes.ok) {
		return error(usersRes.status, "Error retrieving users");
	}

	const users = (await usersRes.json()) as UserWithRoles[];

	if (shouldGetSessionCount && sessionCountRes) {
		if (!sessionCountRes.ok) {
			return error(sessionCountRes.status, "Error retrieving session count");
		}

		const sessionCountJson = (await sessionCountRes.json()) as {
			userId: string;
			sessionsCount: number;
		}[];

		const sessionCount = mapSessionCount(sessionCountJson);

		return { users, sessionCount, ...titleData };
	} else {
		return { users, ...titleData };
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
