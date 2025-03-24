import type { InsertBuildingAlias } from "$lib/types/entity";
import { expect, test } from "vitest";
import { RealBuildingAliasRepository } from "./RealBuildingAliasRepository";

function getBuildingAliasToInsert(buildingNumber = "9999"): InsertBuildingAlias {
	return { buildingNumber, alias: "the best building" };
}

test("can get multiple aliases", async () => {
	const repo = new RealBuildingAliasRepository();

	const buildingAliasToInsert1 = getBuildingAliasToInsert();
	const buildingAliasToInsert2 = getBuildingAliasToInsert("9998");

	const insertedBuildingAlias1 = await repo.createBuildingAlias(buildingAliasToInsert1);
	const insertedBuildingAlias2 = await repo.createBuildingAlias(buildingAliasToInsert2);

	const aliasList = await repo.getBuildingAliases();

	expect(aliasList.length).toBeGreaterThanOrEqual(2);

	await repo.deleteBuildingAliasById(insertedBuildingAlias1.id);
	await repo.deleteBuildingAliasById(insertedBuildingAlias2.id);
});

test("can get alias", async () => {
	const repo = new RealBuildingAliasRepository();

	const buildingAliasToInsert = getBuildingAliasToInsert();

	const insertedAlias = await repo.createBuildingAlias(buildingAliasToInsert);
	const gotAlias = await repo.getBuildingAliasById(insertedAlias.id);

	expect(gotAlias?.id).toBeDefined();
	expect(insertedAlias).toStrictEqual(gotAlias);

	await repo.deleteBuildingAliasById(insertedAlias.id);
});

test("cannot get an nonexistent alias", async () => {
	const repo = new RealBuildingAliasRepository();

	const potentialAlias = await repo.getBuildingAliasById("e");

	expect(potentialAlias).toBeUndefined();
});

test("can insert alias", async () => {
	const repo = new RealBuildingAliasRepository();

	const buildingAliasToInsert = getBuildingAliasToInsert();

	const insertedAlias = await repo.createBuildingAlias(buildingAliasToInsert);

	expect(insertedAlias).toStrictEqual({ ...buildingAliasToInsert, id: insertedAlias.id });

	await repo.deleteBuildingAliasById(insertedAlias.id);
});

test("throws error on invalid insert", async () => {
	const repo = new RealBuildingAliasRepository();

	// @ts-expect-error intentionally inserted an invalid alias
	const insertPromise = repo.createBuildingAlias({ alias: "neat alias" });

	await expect(insertPromise).rejects.toThrowError();
});

test("can update aliases", async () => {
	const repo = new RealBuildingAliasRepository();

	const buildingAliasToInsert = getBuildingAliasToInsert();

	const insertedAlias = await repo.createBuildingAlias(buildingAliasToInsert);

	const changedAlias = await repo.updateBuildingAliasById(insertedAlias.id, {
		...insertedAlias,
		alias: "okay building",
	});

	expect(changedAlias).toStrictEqual({ ...insertedAlias, alias: "okay building" });

	const refetchedAlias = await repo.getBuildingAliasById(insertedAlias.id);

	expect(changedAlias).toStrictEqual(refetchedAlias);

	await repo.deleteBuildingAliasById(insertedAlias.id);
});

test("can delete aliases", async () => {
	const repo = new RealBuildingAliasRepository();

	const buildingAliasToInsert = getBuildingAliasToInsert();

	const insertedAlias = await repo.createBuildingAlias(buildingAliasToInsert);

	expect(insertedAlias.id).toBeDefined();

	const deletedAlias = await repo.deleteBuildingAliasById(insertedAlias.id);

	expect(deletedAlias).toStrictEqual(insertedAlias);

	const gotAliasAfterDelete = await repo.getBuildingAliasById(insertedAlias.id);

	expect(gotAliasAfterDelete).toBeUndefined();
});

test("returns undefined when trying to delete a nonexistent alias", async () => {
	const repo = new RealBuildingAliasRepository();

	const deletedAlias = await repo.deleteBuildingAliasById("eh");

	expect(deletedAlias).toBeUndefined();
});
