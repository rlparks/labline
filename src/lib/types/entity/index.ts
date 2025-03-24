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

/**
 * Represents a connection between the building info
 * recieved from the Chematix file and the name(s)
 * the building commonly goes by.
 */
export interface BuildingAlias {
	id: string;
	buildingNumber: string;
	alias: string;
}

export type InsertBuildingAlias = Omit<BuildingAlias, "id">;
