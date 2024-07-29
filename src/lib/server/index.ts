import { env } from "$env/dynamic/private";
import type { Lab } from "$lib/types";
import * as fs from "node:fs/promises";
import Papa from "papaparse";

export async function getLabData(): Promise<Lab[]> {
	// TODO
	const path = `${env.ABSOLUTE_DIR_PATH}/E__www_chematix_barcodes__ACTIVE_LABORATORIES_2024-07-29.csv`;
	const file = await fs.readFile(path, "utf8");
	const labs = Papa.parse<Lab>(file, { header: true });

	return labs.data;
}
