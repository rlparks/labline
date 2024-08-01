import { env } from "$env/dynamic/private";
import type { Lab } from "$lib/types";
import * as fs from "node:fs/promises";
import Papa from "papaparse";

const SERVER_FILE_NAME = "ACTIVE_LABORATORIES.csv";
const LAB_FILE_PREFIX = "E__www_chematix_barcodes__ACTIVE_LABORATORIES_";

export async function getLabData(): Promise<Lab[]> {
	const path: string = await getFilePath();

	try {
		const file = await fs.readFile(path, "utf8");

		const labs = Papa.parse<Lab>(file, { header: true });

		return labs.data;
	} catch {
		throw new Error("File not found");
	}
}

// returns the file directly from the share if possible,
// else the latest file downloaded from Chematix
async function getFilePath(): Promise<string> {
	const directoryPath = env.ABSOLUTE_DIR_PATH;

	try {
		const fileNames = await fs.readdir(directoryPath);

		if (fileNames.includes(SERVER_FILE_NAME)) {
			// if complete file exists, return path
			return `${directoryPath}/${SERVER_FILE_NAME}`;
		}

		const activeLabFileNames = fileNames.filter((fileName) => fileName.startsWith(LAB_FILE_PREFIX));

		if (activeLabFileNames.length === 0) {
			throw new Error("No lab files found");
		}

		// otherwise find latest date
		activeLabFileNames.sort();
		// [
		// 	"E__www_chematix_barcodes__ACTIVE_LABORATORIES_2024-07-29.csv",
		// 	"E__www_chematix_barcodes__ACTIVE_LABORATORIES_2024-08-01.csv",
		// ]
		const latestFileName = activeLabFileNames[activeLabFileNames.length - 1];
		return `${directoryPath}/${latestFileName}`;
	} catch (err) {
		console.error("Error reading directory", err);
	}
	return "";
}
