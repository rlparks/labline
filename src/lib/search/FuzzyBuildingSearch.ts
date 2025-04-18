import type { BuildingWithAlias } from "$lib/types";
import Fuse from "fuse.js";
import { FuzzySearch } from "./FuzzySearch";

/**
 * Fuzzy search for {@link Building}s.
 */
export class FuzzyBuildingSearch extends FuzzySearch<BuildingWithAlias> {
	fuse: Fuse<BuildingWithAlias>;
	private static FUSE_BUILDING_OPTIONS = {
		keys: ["name", "number", "alias"],
	};

	constructor(items: BuildingWithAlias[]) {
		super(items);

		this.fuse = new Fuse(items, FuzzyBuildingSearch.FUSE_BUILDING_OPTIONS);
	}

	search(searchTerm: string) {
		return this.fuse.search(searchTerm, FuzzyBuildingSearch.FUSE_SEARCH_OPTIONS);
	}
}
