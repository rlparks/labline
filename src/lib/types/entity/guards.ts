import {
	ROLES_LIST,
	type Role,
	type User,
	type UserRole,
	type UserWithRoles,
} from "$lib/types/entity";

const usernameLength = [1, 255] as const;
export function usernameIsValid(username: unknown): username is string {
	return (
		typeof username === "string" &&
		username.length >= usernameLength[0] &&
		username.length <= usernameLength[1]

		// probably fine to ignore? surely...
		// /^[a-z0-9_-]+$/.test(username)
	);
}

function idIsValid(id: unknown): id is string {
	return typeof id === "string" && id.length > 0;
}

function nameIsValid(name: unknown): name is string {
	return typeof name === "string" && name.length <= 255;
}

export function roleIsValid(role: unknown): role is Role {
	return typeof role === "string" && ROLES_LIST.includes(role as Role);
}

export function userRoleIsValid(userRole: unknown): userRole is UserRole {
	const tempUserRole = userRole as UserRole;

	return (
		idIsValid(tempUserRole?.id) &&
		idIsValid(tempUserRole?.userId) &&
		roleIsValid(tempUserRole?.role)
	);
}

export function userRoleArrayIsValid(array: unknown[]): array is UserRole[] {
	for (const potentialUserRole of array as UserRole[]) {
		if (!userRoleIsValid(potentialUserRole)) {
			return false;
		}
	}

	return true;
}

export function userWithRolesIsValid(user: unknown): user is UserWithRoles {
	return postUserWithRolesIsValid(user) && "id" in user && idIsValid(user.id);
}

export function isUserWithRolesArray(array: unknown[]): array is UserWithRoles[] {
	for (const potentialUser of array as UserWithRoles[]) {
		if (!userWithRolesIsValid(potentialUser)) {
			return false;
		}
	}

	return true;
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
	try {
		for (const role of tempUser.roles) {
			if (!roleIsValid(role)) {
				rolesAreValid = false;
				break;
			}
		}
	} catch {
		return false;
	}

	return nameIsValid(tempUser?.name) && usernameIsValid(tempUser?.username) && rolesAreValid;
}

export function userIsValid(user: unknown): user is User {
	const tempUser = user as User;
	return (
		idIsValid(tempUser?.id) && nameIsValid(tempUser?.name) && usernameIsValid(tempUser?.username)
	);
}
