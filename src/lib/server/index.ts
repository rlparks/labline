import { env } from "$env/dynamic/private";
import type { FileStats, Lab, RawUser, SafeUser } from "$lib/types";
import * as fs from "node:fs/promises";
import Papa from "papaparse";

/**
 * The "authoritative" file from the Chematix server
 */
const SERVER_FILE_NAME = "ACTIVE_LABORATORIES.csv";

/**
 * The prefix of the secondary files to check.
 */
// const LAB_FILE_PREFIX = "E__www_chematix_barcodes__ACTIVE_LABORATORIES_";
const LAB_FILE_PREFIX = "ACTIVE_LABORATORIES_";

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
			const authoritativeFileIsValid = await isLabFileValid(potentialServerFilePath);

			if (authoritativeFileIsValid) {
				return potentialServerFilePath;
			}
		}

		// authoritative file is not valid
		// check secondary files

		const activeLabFileNames = fileNames.filter((fileName) => fileName.startsWith(LAB_FILE_PREFIX));

		if (activeLabFileNames.length !== 0) {
			// otherwise find latest date
			activeLabFileNames.sort();
			// [
			// 	"E__www_chematix_barcodes__ACTIVE_LABORATORIES_2024-07-29.csv",
			// 	"E__www_chematix_barcodes__ACTIVE_LABORATORIES_2024-08-01.csv",
			// ]

			// return the last good file
			for (let currentIndex = activeLabFileNames.length - 1; currentIndex >= 0; currentIndex--) {
				const currentFileName = activeLabFileNames[currentIndex];
				const currentFilePath = `${directoryPath}/${currentFileName}`;
				const currentFileIsValid = await isLabFileValid(currentFilePath);
				if (currentFileIsValid) {
					return currentFilePath;
				}
			}
		}

		throw new Error("No lab files found");
	} catch (err) {
		console.error("Error reading directory", err);
	}
	return "";
}

/**
 * Exposes lab file stats - useful for determining the
 * freshness of the data.
 *
 * @returns the stats of the "best" lab file
 */
export async function getLabFileStats(): Promise<FileStats | null> {
	const path: string = await getFilePath();

	if (path !== "") {
		const pathPieces = path.split("/");
		const fileName = pathPieces.pop();

		const rawStats = await getFileStats(path);

		if (rawStats && fileName) {
			return {
				fileName,
				stats: {
					sizeBytes: rawStats.size,
					atimeMs: rawStats.atimeMs,
					mtimeMs: rawStats.mtimeMs,
					birthtimeMs: rawStats.birthtimeMs,
				},
			};
		}
	}
	return null;
}

/**
 * Helper function to check if the Chematix lab file is valid.
 *
 * @param potentialServerFilePath the file to check
 * @returns true if file exists and is above the minimum size
 */
async function isLabFileValid(potentialServerFilePath: string) {
	const fileStats = await getFileStats(potentialServerFilePath);
	if (!fileStats) {
		return false;
	}

	return fileStats.isFile() && fileStats.size > MINIMUM_VALID_FILE_SIZE_BYTES;
}

/**
 * Helper function to get FS stats
 *
 * @param filePath file path
 * @returns stats
 */
async function getFileStats(filePath: string) {
	try {
		return await fs.stat(filePath);
	} catch {
		return null;
	}
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

/**
 * @returns a readable date/time
 */
export function getCurrentFormattedDateTime(): string {
	const now = new Date();
	const dateString = now.toISOString().split("T")[0];
	return `${dateString} ${now.toLocaleTimeString()}`;
}
