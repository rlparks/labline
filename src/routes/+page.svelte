<script lang="ts">
	import { Message, BuildingCard } from "$lib/components";
	import { FuzzyBuildingSearch } from "$lib/search/FuzzyBuildingSearch.js";

	const { data } = $props();

	let search = $state<string>("");

	const searcher = new FuzzyBuildingSearch(data.buildings);

	const filteredBuildings = $derived(searcher.search(search));
</script>

<svelte:head>
	<title>knowledger</title>
</svelte:head>

<h3 class="center-align">Emergency Contacts</h3>

<div class="space"></div>

<div class="center-align">
	<a class="button" href="/labs">Search All Labs</a>
</div>

<h3 class="center-align">Search by Building</h3>

<div class="field label border">
	<input id="input-search-buildings" bind:value={search} />
	<label for="input-search-buildings">Building Name or Number</label>
	<i>search</i>
</div>

{#each filteredBuildings as building (building.item.number)}
	<BuildingCard building={building.item} />
{/each}

{#if filteredBuildings.length === 0}
	<Message
		iconText="domain"
		headerText="No buildings found"
		messageText="Try searching using a building name or number"
	/>
{/if}
