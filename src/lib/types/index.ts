export type { User, Session } from "$lib/server/db/schema";

/**
 * `User`s with additional info removed.
 */
export interface SafeUser {
	id: string;
	username: string;
	name: string;
}

/**
 * Lab information obtained from Chematix.
 */
export interface Lab {
	"Bldg Number": string;
	"Bldg Name": string;
	"Room Number": string;
	"Lab Name": string;
	"PI Last Name": string;
	"PI First Name": string;
	"PI email": string;
	"Super Last Name": string;
	"Super First Name": string;
	"Super email": string;
	"Container Count": number;
	"Primary Contact": string;
	"Secondary Contact": string;
}

/**
 * A building on UGA's campus.
 */
export interface Building {
	name: string;
	number: string;
}

/**
 * File stats for the Chematix lab file.
 */
export interface FileStats {
	fileName: string;
	stats: {
		sizeBytes: number;
		atimeMs: number;
		mtimeMs: number;
		birthtimeMs: number;
	};
}
