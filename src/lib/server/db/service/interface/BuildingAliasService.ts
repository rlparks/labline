import type { BuildingAlias, InsertBuildingAlias } from "$lib/types/entity";

/**
 * Exposes `BuildingAlias` data to application.
 * Currently just passes through Repository methods.
 */
export interface BuildingAliasService {
	/**
	 * Retrieve all entries from the database.
	 */
	getBuildingAliases(): Promise<BuildingAlias[]>;

	/**
	 * Find a `BuildingAlias` by ID.
	 *
	 * @param buildingAliasId the `BuildingAlias` to search for
	 * @returns the `BuildingAlias` or undefined if not found
	 * @throws on DB connection error
	 */
	getBuildingAliasById(buildingAliasId: string): Promise<BuildingAlias | undefined>;

	/**
	 * Find a `BuildingAlias` by building number.
	 *
	 * @param buildingNumber the `BuildingAlias` to search for
	 * @returns the `BuildingAlias` or undefined if not found
	 * @throws on DB connection error
	 */
	getBuildingAliasByBuildingNumber(buildingNumber: string): Promise<BuildingAlias | undefined>;

	/**
	 * Insert a `BuildingAlias` into the database.
	 *
	 * @param newBuildingAlias the `BuildingAlias` to insert
	 * @returns the new `BuildingAlias`
	 * @throws if it randomly generates a duplicate ID
	 * @throws on DB connection error
	 */
	createBuildingAlias(newBuildingAlias: InsertBuildingAlias): Promise<BuildingAlias>;

	/**
	 * Update a `BuildingAlias` in the database.
	 *
	 * @param buildingAliasId the ID of the `BuildingAlias` to update
	 * @param newBuildingAlias the data to replace the existing row with
	 * @returns the updated `BuildingAlias` or undefined if none existed with that ID
	 */
	updateBuildingAliasById(
		buildingAliasId: string,
		newBuildingAlias: InsertBuildingAlias,
	): Promise<BuildingAlias | undefined>;

	/**
	 * Delete a `BuildingAlias` from the database.
	 *
	 * @param buildingAliasId the ID of the `BuildingAlias` to delete
	 * @returns the deleted `BuildingAlias` or undefined if it didn't exist
	 * @throws on DB connection error
	 */
	deleteBuildingAliasById(buildingAliasId: string): Promise<BuildingAlias | undefined>;

	/**
	 * Delete a `BuildingAlias` from the database by building number.
	 *
	 * @param buildingNumber the building number of the `BuildingAlias` to delete
	 * @returns the deleted `BuildingAlias` or undefined if it didn't exist
	 * @throws on DB connection error
	 */
	deleteBuildingAliasByBuildingNumber(buildingNumber: string): Promise<BuildingAlias | undefined>;
}
