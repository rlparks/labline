import type { Building, FileStats, Lab } from "$lib/types";
import Papa from "papaparse";
import { FileHelper } from "./FileHelper";

/**
 * The Labline API
 */
export default class Labline {
	private fileHelper: FileHelper;

	constructor() {
		this.fileHelper = new FileHelper();
	}

	/**
	 * @returns all {@link Lab}s stored in the lab file
	 * @throws if the file was not found on the server
	 */
	async getLabs(): Promise<Lab[]> {
		try {
			const file = await this.fileHelper.readLabFile();

			const labs = Papa.parse<Lab>(file, { header: true });

			// somehow the end of the data is
			// { 'Campus Number': '' }
			const lastLab = labs.data[labs.data.length - 1];
			if (lastLab && !("Lab Name" in lastLab)) {
				labs.data.pop();
			}

			return labs.data;
		} catch {
			throw new Error("File not found");
		}
	}

	/**
	 * @param buildingNumber the building number to search
	 * @returns all {@link Lab}s in the specified building
	 * @throws if an error occurs while retrieving the labs
	 */
	async getBuildingLabs(buildingNumber: string): Promise<Lab[]> {
		const labs = await this.getLabs();
		const buildingLabs = labs.filter((lab) => lab["Bldg Number"] === buildingNumber);

		return buildingLabs;
	}

	/**
	 * @returns all unique {@link Building}s
	 * @throws if an error occurs while retrieving the labs
	 */
	async getBuildings() {
		const labs = await this.getLabs();
		const buildings: Building[] = labs.map((lab) => ({
			name: lab["Bldg Name"],
			number: lab["Bldg Number"],
		}));

		const seenBuildingNumbers = new Set<string>();

		const uniqueBuildings = buildings.filter((building) => {
			if (seenBuildingNumbers.has(building.number) || !building.number) {
				return false;
			}
			seenBuildingNumbers.add(building.number);
			return true;
		});

		return uniqueBuildings;
	}

	/**
	 * Passes through the {@link FileHelper.getLabFileStats} method
	 *
	 * @returns lab file stats
	 */
	async getLabFileStats(): Promise<FileStats | null> {
		return this.fileHelper.getLabFileStats();
	}
}
