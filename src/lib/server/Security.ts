import type { Role, UserWithRole } from "$lib/types";
import { error, type RequestEvent } from "@sveltejs/kit";

// https://www.captaincodeman.com/securing-your-sveltekit-app
export class Security {
	private user: UserWithRole | null;

	constructor(event: RequestEvent) {
		this.user = event.locals.user;
	}

	isAuthenticated() {
		if (!this.user) {
			return error(401, "Unauthorized");
		}
		return this;
	}

	hasRole(role: Role) {
		if (!this.user) {
			return error(401, "Unauthorized");
		}

		if (this.user.role !== role) {
			return error(403, `Missing role: ${role}`);
		}

		return this;
	}

	isAdmin() {
		if (!this.user) {
			return error(401, "Unauthorized");
		}

		if (this.user.role !== "admin") {
			return error(403, `Missing role: admin`);
		}

		return this;
	}
}
