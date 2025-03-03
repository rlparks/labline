// See https://kit.svelte.dev/docs/types#app

import type ServiceAggregator from "$db/service/ServiceAggregator";
import Labline from "$lib/server/api/Labline";
import type { UserWithRoles } from "$lib/types/entity";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserWithRoles | null;
			labline: Labline;
			session: import("$lib/server/auth").SessionValidationResult["session"];
			security: import("$lib/server/Security").Security;
			db: ServiceAggregator;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
