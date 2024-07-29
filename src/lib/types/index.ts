/**
 * `User`s directly returned from PocketBase.
 */
export type RawUser = {
	avatar: string;
	collectionId: string;
	collectionName: string;
	created: string;
	email: string;
	emailVisibility: boolean;
	id: string;
	name: string;
	updated: string;
	username: string;
	verified: boolean;
};

/**
 * `User`s with additional info removed.
 */
export interface SafeUser {
	id: string;
	username: string;
	name: string;
	hasAvatar: boolean;
}

export interface Lab {
	"Bldg Number": number;
	"Bldg Name": string;
	"Room Number": number;
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

export interface Building {
	name: string;
	number: number;
}
