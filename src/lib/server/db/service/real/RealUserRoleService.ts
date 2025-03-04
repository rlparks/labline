import type { UserRoleRepository } from "$db/repository/interface/UserRoleRepository";
import type { UserRoleService } from "$db/service/interface/UserRoleService";
import type { Role, UserRole } from "$lib/types/entity";

export class RealUserRoleService implements UserRoleService {
	private readonly userRoleRepository: UserRoleRepository;

	constructor(userRoleRepository: UserRoleRepository) {
		this.userRoleRepository = userRoleRepository;
	}

	createUserRole(newUserRole: { userId: string; role: Role }): Promise<UserRole> {
		return this.userRoleRepository.createUserRole(newUserRole);
	}

	deleteUserRolesByUserId(userId: string): Promise<UserRole[]> {
		return this.userRoleRepository.deleteUserRolesByUserId(userId);
	}
}
