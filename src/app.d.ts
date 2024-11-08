// See https://kit.svelte.dev/docs/types#app

import Knowledger from "$lib/server/api/Knowledger";
import type { UserWithRole } from "$lib/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserWithRole | null;
			knowledger: Knowledger;
			session: import("$lib/server/auth").SessionValidationResult["session"];
			security: import("$lib/server/Security").Security;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
