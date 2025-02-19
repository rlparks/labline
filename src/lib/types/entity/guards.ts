import { ROLES_LIST, type Role, type UserWithRoles } from "$lib/types/entity";

const usernameLength = [1, 255] as const;
export function usernameIsValid(username: unknown): username is string {
	return (
		typeof username === "string" &&
		username.length >= usernameLength[0] &&
		username.length <= usernameLength[1] &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function idIsValid(id: unknown): id is string {
	return typeof id === "string" && id.length > 0;
}

function nameIsValid(name: unknown): name is string {
	return typeof name === "string" && name.length <= 255;
}

function roleIsValid(role: unknown): role is Role {
	return typeof role === "string" && ROLES_LIST.includes(role as Role);
}

export function userWithRolesIsValid(user: unknown): user is UserWithRoles {
	return postUserWithRolesIsValid(user) && "id" in user && idIsValid(user.id);
}

export function postUserWithRolesIsValid(user: unknown): user is {
	username: string;
	name: string;
	roles: Role[];
} {
	const tempUser = user as {
		username: string;
		name: string;
		roles: Role[];
	};

	let rolesAreValid = true;
	for (const role of tempUser.roles) {
		if (!roleIsValid(role)) {
			rolesAreValid = false;
			break;
		}
	}

	return nameIsValid(tempUser.name) && usernameIsValid(tempUser.username) && rolesAreValid;
}
