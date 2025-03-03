import type ServiceAggregator from "$db/service/ServiceAggregator";
import { env } from "$env/dynamic/private";
import type { Role } from "$lib/types/entity";

export async function onServerStart(db: ServiceAggregator) {
	const REQUIRED_ENV_VARIABLES = [
		"DATABASE_URL",
		"OIDC_DISCOVERY_ENDPOINT",
		"OIDC_CLIENT_ID",
		"OIDC_CLIENT_SECRET",
		"ABSOLUTE_DIR_PATH",
	];

	const missingVars = [];
	for (const envVar of REQUIRED_ENV_VARIABLES) {
		if (!env[envVar]) {
			missingVars.push(envVar);
		}
	}
	if (missingVars.length !== 0) {
		console.log(`${missingVars.join(", ")} must be set`);
		process.exit(1);
	}

	if (env.CREATE_ACCOUNT) {
		try {
			const roles: Role[] = ["superadmin"];

			const userWithCreateAccountUsername = await db.users.getUserByUsername(env.CREATE_ACCOUNT);

			if (!userWithCreateAccountUsername) {
				const newUser = await db.users.createUser({
					username: env.CREATE_ACCOUNT,
					name: "Initial User",
					roles,
				});

				console.log(`Created user "${newUser.username}"`);
			} else {
				await db.users.updateUserWithRolesById(userWithCreateAccountUsername.id, {
					...userWithCreateAccountUsername,
					roles,
				});
				console.log(
					`User "${userWithCreateAccountUsername.username}" already existed. Updated role to superadmin.`,
				);
			}
		} catch (e) {
			if (e instanceof Error) {
				console.log("Error creating initial account: ", e.message);
			}
		}
	}
}
