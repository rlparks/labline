<script lang="ts">
	import { BuildingCard, Input, Message } from "$lib/components";
	import { FuzzyBuildingSearch } from "$lib/search/FuzzyBuildingSearch";

	const { data } = $props();

	let search = $state<string>("");

	const searcher = new FuzzyBuildingSearch(data.buildings);

	const filteredBuildings = $derived(searcher.search(search));
</script>

<svelte:head>
	<title>labline · Search by Building</title>
	<meta name="description" content="Search emergency contacts by building." />
</svelte:head>

<h3 class="center-align">Emergency Contacts</h3>

<h3 class="center-align">Search by Building</h3>

<Input label="Building Name or Number" icon="search" bind:value={search} />

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
