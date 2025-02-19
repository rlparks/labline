import { ROLES_LIST, type Role, type UserWithRoles } from "$lib/types/entity";
import { generateRandomString } from "@oslojs/crypto/random";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateTextId(length = 21): string {
	return generateRandomString({ read: (bytes) => crypto.getRandomValues(bytes) }, alphabet, length);
}

const usernameLength = [1, 255] as const;
export function usernameIsValid(username: unknown): username is string {
	return (
		typeof username === "string" &&
		username.length >= usernameLength[0] &&
		username.length <= usernameLength[1] &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

export function nameIsValid(name: unknown): name is string {
	return typeof name === "string" && name.length <= 255;
}

export function roleIsValid(role: unknown): role is Role {
	return typeof role === "string" && ROLES_LIST.includes(role as Role);
}

export function idIsValid(id: unknown): id is string {
	return typeof id === "string" && id.length > 0;
}

export function userWithRolesIsValid(user: unknown): user is UserWithRoles {
	const tempUser = user as UserWithRoles;

	let rolesAreValid = true;
	for (const role of tempUser.roles) {
		if (!roleIsValid(role)) {
			rolesAreValid = false;
			break;
		}
	}

	return (
		typeof tempUser.id === "string" &&
		typeof tempUser.username === "string" &&
		typeof tempUser.name === "string" &&
		rolesAreValid
	);
}
