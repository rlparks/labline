export const ROLES_LIST = ["admin", "superadmin"] as const;
export type Role = (typeof ROLES_LIST)[number];

/**
 * Sessions without tokens.
 */
export interface SafeSession {
	id: string;
	userId: string;
	expiresAt: Date;
	ipAddress: string | null;
}

export interface Session extends SafeSession {
	hashedToken: string;
	oidcIdToken: string;
}

export interface User {
	id: string;
	username: string;
	name: string;
}

export interface UserWithRoles extends User {
	roles: Role[];
}

export interface UserRole {
	id: string;
	userId: string;
	role: Role;
}
