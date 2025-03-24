import type { InsertBuildingAlias, UserWithRoles } from "$lib/types/entity";

/**
 * @param newUser the user to validate
 * @throws in various ways if the user is invalid
 */
export function validateUserFields(newUser: Omit<UserWithRoles, "id">) {
	const MAX_USERNAME_LENGTH = 25;
	const MAX_NAME_LENGTH = 30;

	if (newUser.username.length > MAX_USERNAME_LENGTH) {
		throw new Error(`Username cannot be longer than ${MAX_USERNAME_LENGTH} characters`);
	}
	if (newUser.username.length === 0) {
		throw new Error("Username cannot be empty");
	}
	if (newUser.name.length > MAX_NAME_LENGTH) {
		throw new Error(`Name cannot be longer than ${MAX_NAME_LENGTH} characters`);
	}
	if (newUser.name.length === 0) {
		throw new Error("Name cannot be empty");
	}
}

/**
 *
 * @param newBuildingAlias the new BuildingAlias to validate
 * @throws in various ways if the BuildingAlias is invalid
 */
export function validateBuildingAliasFields(newBuildingAlias: InsertBuildingAlias) {
	const BUILDING_NUMBER_LENGTH = 4;
	const MAX_ALIAS_LENGTH = 50;

	if (newBuildingAlias.buildingNumber.length !== BUILDING_NUMBER_LENGTH) {
		throw new Error(`Building Number must be exactly ${BUILDING_NUMBER_LENGTH} characters`);
	}

	if (newBuildingAlias.alias.length === 0) {
		throw new Error(`Alias cannot be empty`);
	}

	if (newBuildingAlias.alias.length > MAX_ALIAS_LENGTH) {
		throw new Error(`Alias cannot be longer than ${MAX_ALIAS_LENGTH} characters`);
	}
}
