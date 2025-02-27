import { sql } from "$db";
import { generateTextId, hideError } from "$db/repository";
import type { UserRoleRepository } from "$db/repository/interface/UserRoleRepository";
import type { Role, UserRole } from "$lib/types/entity";
import { roleIsValid, userRoleArrayIsValid, userRoleIsValid } from "$lib/types/entity/guards";

export class RealUserRoleRepository implements UserRoleRepository {
	async getUserRoleById(userRoleId: string): Promise<UserRole | undefined> {
		try {
			const [userRole] = await sql`SELECT id, user_id, role
                                        FROM user_roles
                                        WHERE user_roles.id = ${userRoleId}`;

			if (userRoleIsValid(userRole) || userRole === undefined) {
				return userRole;
			}
		} catch (err) {
			hideError(err, "RealUserRoleRepository getUserRoleById: ");
		}

		// effectively the "else" to the if (userRoleIsValid)
		throw new Error("UserRole malformed!");
	}

	async createUserRole(newUserRole: { userId: string; role: Role }): Promise<UserRole> {
		if (!roleIsValid(newUserRole.role)) {
			throw new Error(`Invalid role: ${newUserRole.role}`);
		}

		try {
			// good luck
			const id = generateTextId();
			const [userRole] = await sql`INSERT INTO user_roles (id, user_id, role)
                                        VALUES (${id}, ${newUserRole.userId}, ${newUserRole.role})
                                        RETURNING id, user_roles.user_id, user_roles.role`;

			if (userRoleIsValid(userRole)) {
				return userRole;
			}
		} catch (err) {
			hideError(err, "RealUserRoleRepository createUserRole: ");
		}

		throw new Error("UserRole malformed!");
	}

	async deleteUserRolesByUserId(userId: string): Promise<UserRole[]> {
		try {
			const deletedRoles = await sql`DELETE FROM user_roles
                                            WHERE user_id = ${userId}
                                            RETURNING id, user_id, role`;

			if (userRoleArrayIsValid(deletedRoles)) {
				return deletedRoles;
			}
		} catch (err) {
			hideError(err, "RealUserRoleRepository createUserRole: ");
		}

		throw new Error("UserRole malformed!");
	}
}
