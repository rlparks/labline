import type { UserWithRole } from "$lib/types";
import type { PageServerLoad } from "./$types";

const EXAMPLE_USERS: UserWithRole[] = [
	{
		users: {
			id: "a",
			username: "admin",
			name: "Admin",
		},
		user_roles: {
			userId: "a",
			role: "admin",
		},
	},
	{
		users: {
			id: "b",
			username: "user",
			name: "User",
		},
		user_roles: null,
	},
	{
		users: {
			id: "c",
			username: "guest",
			name: "Guest",
		},
		user_roles: null,
	},
];

export const load = (async () => {
	return { users: EXAMPLE_USERS };
}) satisfies PageServerLoad;
