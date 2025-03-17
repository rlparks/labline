import { sql } from "$db";
import { generateTextId, hideError } from "$db/repository";
import type { BuildingAliasRepository } from "$db/repository/interface/BuildingAliasRepository";
import type { BuildingAlias, InsertBuildingAlias } from "$lib/types/entity";
import { buildingAliasArrayIsValid, buildingAliasIsValid } from "$lib/types/entity/guards";

const BUILDING_ALIAS_COLUMNS = sql`id, building_number, alias`;

export class RealBuildingAliasRepository implements BuildingAliasRepository {
	async getBuildingAliases(): Promise<BuildingAlias[]> {
		try {
			const aliases = await sql`SELECT ${BUILDING_ALIAS_COLUMNS}
                                                FROM building_alias
                                                ORDER BY building_number;`;

			if (buildingAliasArrayIsValid(aliases)) {
				return aliases;
			}
		} catch (err) {
			hideError(err, `RealBuildingAliasRepository getBuildingAliases: `);
		}

		throw new Error("Building alias data malformed!");
	}

	async getBuildingAliasById(buildingAliasId: string): Promise<BuildingAlias | undefined> {
		try {
			const [buildingAlias] = await sql`SELECT ${BUILDING_ALIAS_COLUMNS}
                                                FROM building_alias
                                                WHERE id = ${buildingAliasId};`;

			if (buildingAliasIsValid(buildingAlias) || buildingAlias === undefined) {
				return buildingAlias;
			}
		} catch (err) {
			hideError(err, `RealBuildingAliasRepository getBuildingAliasById: `);
		}

		throw new Error("Building alias data malformed!");
	}

	async getBuildingAliasByBuildingNumber(
		buildingNumber: string,
	): Promise<BuildingAlias | undefined> {
		try {
			const [buildingAlias] = await sql`SELECT ${BUILDING_ALIAS_COLUMNS}
                                                FROM building_alias
                                                WHERE building_number = ${buildingNumber};`;

			if (buildingAliasIsValid(buildingAlias) || buildingAlias === undefined) {
				return buildingAlias;
			}
		} catch (err) {
			hideError(err, `RwealBuildingAliasRepository getBuildingAliasByBuildingNumber: `);
		}

		throw new Error("Building alias data malformed!");
	}

	async createBuildingAlias(newBuildingAlias: InsertBuildingAlias): Promise<BuildingAlias> {
		try {
			const id = generateTextId();
			const [buildingAlias] = await sql`INSERT INTO building_alias (${BUILDING_ALIAS_COLUMNS})
                                    VALUES (${id}, ${newBuildingAlias.buildingNumber}, ${newBuildingAlias.alias})
                                    RETURNING ${BUILDING_ALIAS_COLUMNS};`;

			if (buildingAliasIsValid(buildingAlias)) {
				return buildingAlias;
			}
		} catch (err) {
			hideError(err, `RealBuildingAliasRepository createBuildingAlias: `);
		}

		throw new Error("Building alias data malformed!");
	}

	async updateBuildingAliasById(
		buildingAliasId: string,
		newBuildingAlias: InsertBuildingAlias,
	): Promise<BuildingAlias | undefined> {
		try {
			const [buildingAlias] = await sql`UPDATE building_alias
                                                SET ${sql(newBuildingAlias, "buildingNumber", "alias")}
                                                WHERE id = ${buildingAliasId}
                                                RETURNING ${BUILDING_ALIAS_COLUMNS};`;

			if (buildingAliasIsValid(buildingAlias) || buildingAlias === undefined) {
				return buildingAlias;
			}
		} catch (err) {
			hideError(err, `RealBuildingAliasRepository updateBuildingAliasById: `);
		}

		throw new Error("Building alias data malformed!");
	}

	async deleteBuildingAliasById(buildingAliasId: string): Promise<BuildingAlias | undefined> {
		try {
			const [buildingAlias] = await sql`DELETE FROM building_alias
                                                WHERE id = ${buildingAliasId}
                                                RETURNING ${BUILDING_ALIAS_COLUMNS};`;

			if (buildingAliasIsValid(buildingAlias) || buildingAlias === undefined) {
				return buildingAlias;
			}
		} catch (err) {
			hideError(err, `RealBuildingAliasRepository deleteBuildingAliasById: `);
		}

		throw new Error("Building alias data malformed!");
	}
}
