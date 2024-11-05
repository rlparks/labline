// See https://kit.svelte.dev/docs/types#app

import type { SafeUser } from "$lib/types";
import Knowledger from "$lib/server/api/Knowledger";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: SafeUser | null;
			knowledger: Knowledger;
			session: import("$lib/server/auth").SessionValidationResult["session"];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
