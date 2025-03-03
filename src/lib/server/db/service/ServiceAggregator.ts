import { RealSessionRepository } from "$db/repository/real/RealSessionRepository";
import { RealUserRepository } from "$db/repository/real/RealUserRepository";
import { RealUserRoleRepository } from "$db/repository/real/RealUserRoleRepository";
import type { SessionService } from "./interface/SessionService";
import type { UserRoleService } from "./interface/UserRoleService";
import type { UserService } from "./interface/UserService";
import { RealSessionService } from "./real/RealSessionService";
import { RealUserRoleService } from "./real/RealUserRoleService";
import { RealUserService } from "./real/RealUserService";

export default class ServiceAggregator {
	users: UserService;
	userRoles: UserRoleService;
	sessions: SessionService;

	constructor() {
		const userRoleRepo = new RealUserRoleRepository();

		this.users = new RealUserService(new RealUserRepository(), userRoleRepo);
		this.userRoles = new RealUserRoleService(userRoleRepo);
		this.sessions = new RealSessionService(new RealSessionRepository());
	}
}
