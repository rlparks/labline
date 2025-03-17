import type { BuildingAliasRepository } from "$db/repository/interface/BuildingAliasRepository";
import type { BuildingAliasService } from "$db/service/interface/BuildingAliasService";
import type { BuildingAlias, InsertBuildingAlias } from "$lib/types/entity";

export class RealBuildingAliasService implements BuildingAliasService {
	private readonly buildingAliasRepository: BuildingAliasRepository;

	constructor(buildingAliasRepository: BuildingAliasRepository) {
		this.buildingAliasRepository = buildingAliasRepository;
	}

	async getBuildingAliases(): Promise<BuildingAlias[]> {
		return await this.buildingAliasRepository.getBuildingAliases();
	}

	async getBuildingAliasById(buildingAliasId: string): Promise<BuildingAlias | undefined> {
		return await this.buildingAliasRepository.getBuildingAliasById(buildingAliasId);
	}

	async getBuildingAliasByBuildingNumber(
		buildingNumber: string,
	): Promise<BuildingAlias | undefined> {
		return await this.buildingAliasRepository.getBuildingAliasByBuildingNumber(buildingNumber);
	}

	async createBuildingAlias(newBuildingAlias: InsertBuildingAlias): Promise<BuildingAlias> {
		// unsure if this check should be done here or closer to the client side
		// it's not like anything terrible happens if we have a wacky number
		// if (newBuildingAlias.buildingNumber.length !== 4) {
		//     throw new Error("Building Number must be exactly 4 characters!")
		// }
		return await this.buildingAliasRepository.createBuildingAlias(newBuildingAlias);
	}

	async updateBuildingAliasById(
		buildingAliasId: string,
		newBuildingAlias: InsertBuildingAlias,
	): Promise<BuildingAlias | undefined> {
		return await this.buildingAliasRepository.updateBuildingAliasById(
			buildingAliasId,
			newBuildingAlias,
		);
	}

	async deleteBuildingAliasById(buildingAliasId: string): Promise<BuildingAlias | undefined> {
		return await this.buildingAliasRepository.deleteBuildingAliasById(buildingAliasId);
	}

	async deleteBuildingAliasByBuildingNumber(
		buildingNumber: string,
	): Promise<BuildingAlias | undefined> {
		return await this.buildingAliasRepository.deleteBuildingAliasByBuildingNumber(buildingNumber);
	}
}
