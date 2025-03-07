import { getCurrentFormattedDateTime } from "$lib";
import type { UserWithRoles } from "$lib/types/entity";

export function logUserAction(user: UserWithRoles, text: string) {
	const nowString = getCurrentFormattedDateTime();
	console.log(`${nowString} · [${user.username}] · ${text}`);
}
