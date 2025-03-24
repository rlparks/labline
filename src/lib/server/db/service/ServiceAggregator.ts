import { RealBuildingAliasRepository } from "$db/repository/real/RealBuildingAliasRepository";
import { RealSessionRepository } from "$db/repository/real/RealSessionRepository";
import { RealUserRepository } from "$db/repository/real/RealUserRepository";
import { RealUserRoleRepository } from "$db/repository/real/RealUserRoleRepository";
import type { BuildingAliasService } from "$db/service/interface/BuildingAliasService";
import type { SessionService } from "$db/service/interface/SessionService";
import type { UserRoleService } from "$db/service/interface/UserRoleService";
import type { UserService } from "$db/service/interface/UserService";
import { RealBuildingAliasService } from "$db/service/real/RealBuildingAliasService";
import { RealSessionService } from "$db/service/real/RealSessionService";
import { RealUserRoleService } from "$db/service/real/RealUserRoleService";
import { RealUserService } from "$db/service/real/RealUserService";

export default class ServiceAggregator {
	users: UserService;
	userRoles: UserRoleService;
	sessions: SessionService;
	buildingAliases: BuildingAliasService;

	constructor() {
		const userRoleRepo = new RealUserRoleRepository();

		this.users = new RealUserService(new RealUserRepository(), userRoleRepo);
		this.userRoles = new RealUserRoleService(userRoleRepo);
		this.sessions = new RealSessionService(new RealSessionRepository());
		this.buildingAliases = new RealBuildingAliasService(new RealBuildingAliasRepository());
	}
}
