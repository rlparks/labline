import { sql } from "$lib/server/db";
import { hideError } from "$lib/server/db/repository";
import type { UserRoleRepository } from "$lib/server/db/repository/interface/UserRoleRepository";
import type { Role, UserRole } from "$lib/types/entity";
import { userRoleIsValid } from "$lib/types/entity/guards";

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
		throw new Error("Method not implemented.");
	}

	async deleteUserRolesByUserId(userId: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
