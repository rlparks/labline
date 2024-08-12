// See https://kit.svelte.dev/docs/types#app

import type { SafeUser } from "$lib/types";
import PocketBase from "pocketbase";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			user: SafeUser | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
