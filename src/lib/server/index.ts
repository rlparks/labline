import type { RawUser, SafeUser } from "$lib/types";

/**
 * Removes unnecessary info from User objects returned from
 * PocketBase, like email.
 *
 * @param user the full {@link RawUser} object
 * @returns a {@link SafeUser} object with a minimum amount of info
 */
export function makeUserSafe(user: RawUser): SafeUser {
	return {
		id: user.id,
		username: user.username,
		name: user.name,
		hasAvatar: !!user.avatar,
	};
}

/**
 * @returns a readable date/time
 */
export function getCurrentFormattedDateTime(): string {
	const now = new Date();
	const dateString = now.toISOString().split("T")[0];
	return `${dateString} ${now.toLocaleTimeString()}`;
}
