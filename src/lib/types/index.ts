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

/**
 * OIDC info passed around the application.
 */
export interface AuthInfo {
	authEndpoint: string;
	tokenEndpoint: string;
	userinfoEndpoint: string;
	endSessionEndpoint: string;
	state: string;
}
