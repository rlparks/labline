import type { UserWithRole } from "$lib/types";
import type { RequestEvent } from "@sveltejs/kit";

export class Security {
	private user: UserWithRole | null;

	constructor(event: RequestEvent) {
		this.user = event.locals.user;
	}
}
