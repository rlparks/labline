import type { Building } from "$lib/types";

/**
 * Validates that the user's submitted building number is used.
 *
 * @param building all valid buildings
 * @param buildingNumber the building number to ensure existence of
 * @throws if there exists no building with the requested building number
 */
export async function validateBuildingNumberExists(buildings: Building[], buildingNumber: string) {
	const matchingBuilding = buildings.find((building) => building.number === buildingNumber);

	if (!matchingBuilding) {
		throw new Error(`No building exists with number ${buildingNumber}`);
	}
}
