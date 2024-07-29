import { env } from "$env/dynamic/private";
import type { Lab } from "$lib/types";
import * as fs from "node:fs/promises";
import Papa from "papaparse";

export async function getLabData(): Promise<Lab[]> {
	const path = `${env.ABSOLUTE_DIR_PATH}/Lab_Emergency_Contacts_2024-06-10.csv`;
	const file = await fs.readFile(path, "utf8");
	const labs = Papa.parse<Lab>(file, { header: true });

	return labs.data;
}
