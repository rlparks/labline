import { env } from "$env/dynamic/private";
import type { Lab, RawUser, SafeUser } from "$lib/types";
import * as fs from "node:fs/promises";
import Papa from "papaparse";

/**
 * The "authoritative" file from the Chematix server
 */
const SERVER_FILE_NAME = "ACTIVE_LABORATORIES.csv";

/**
 * The prefix of all files exported from the Chematix web interface.
 */
const LAB_FILE_PREFIX = "E__www_chematix_barcodes__ACTIVE_LABORATORIES_";

/**
 * The minimum size of the laboratories file to be considered valid.
 */
const MINIMUM_VALID_FILE_SIZE_BYTES = 200 * 1024;

/**
 * @returns all {@link Lab}s stored in the lab file
 * @throws if the file was not found on the server
 */
export async function getLabData(): Promise<Lab[]> {
	const path: string = await getFilePath();

	try {
		const file = await fs.readFile(path, "utf8");

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
 * Returns the file directly from the share if possible,
 * else the latest file downloaded from Chematix
 *
 * @returns the path to the "best" lab file or `""` if not found
 */
async function getFilePath(): Promise<string> {
	const directoryPath = env.ABSOLUTE_DIR_PATH;

	try {
		const fileNames = await fs.readdir(directoryPath);

		if (fileNames.includes(SERVER_FILE_NAME)) {
			const potentialServerFilePath = `${directoryPath}/${SERVER_FILE_NAME}`;
			const fileStats = await fs.stat(potentialServerFilePath);

			if (fileStats.isFile() && fileStats.size > MINIMUM_VALID_FILE_SIZE_BYTES) {
				// if complete file exists, return path
				return potentialServerFilePath;
			}
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

/**
 * Removes unnecessary info from User objects returned from
 * PocketBase, like email.
 *
 * @param user the full {@link RawUser} object
 * @returns a {@link SafeUser} object with a minimum amount of info
 */
export function makeUserSafe(user: RawUser): SafeUser {
	return {
		id: user.id,
		username: user.username,
		name: user.name,
		hasAvatar: !!user.avatar,
	};
}
