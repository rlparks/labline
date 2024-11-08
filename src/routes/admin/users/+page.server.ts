import type { UserWithRole } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	return { users: EXAMPLE_USERS };
}) satisfies PageServerLoad;
