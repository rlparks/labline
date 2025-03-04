// See https://kit.svelte.dev/docs/types#app

import type ServiceAggregator from "$db/service/ServiceAggregator";
import Labline from "$lib/server/api/Labline";
import type Auth from "$lib/server/auth";
import type { Session, UserWithRoles } from "$lib/types/entity";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserWithRoles | null;
			session: Session | null;
			labline: Labline;
			security: import("$lib/server/Security").Security;
			db: ServiceAggregator;
			auth: Auth;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
