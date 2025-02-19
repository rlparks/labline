import type { UserRoleRepository } from "$lib/server/db/repository/interface/UserRoleRepository";
import type { Role, UserRole } from "$lib/types";

export class RealUserRoleRepository implements UserRoleRepository {
	getUserRoleById(userRoleId: string): Promise<UserRole | undefined> {
		throw new Error("Method not implemented.");
	}
	createUserRole(newUserRole: { userId: string; role: Role }): Promise<UserRole> {
		throw new Error("Method not implemented.");
	}
	deleteUserRolesByUserId(userId: string): void {
		throw new Error("Method not implemented.");
	}
}
