import { env } from "$env/dynamic/private";

export async function onServerStart() {
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
			console.log(`CREATE_ACCOUNT is set. Creating user "${env.CREATE_ACCOUNT}"...`);

			// TODO
			// const newUser = await User.createUser(
			// 	env.CREATE_ACCOUNT,
			// 	"Initial User",
			// 	["admin", "superadmin"],
			// 	true,
			// );
			// console.log(`Created user ${newUser.username}`);
		} catch (e) {
			if (e instanceof Error) {
				console.log("Error creating initial account: ", e.message);
			}
		}
	}
}
