import type { User } from "$lib/types";
import type { RequestEvent } from "@sveltejs/kit";

export class Security {
	private user: User | null;
	constructor(event: RequestEvent) {
		this.user = event.locals.user;
	}
}
