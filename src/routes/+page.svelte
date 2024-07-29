<script lang="ts">
	import BuildingCard from "$lib/components/BuildingCard.svelte";
	import Fuse from "fuse.js";
	import ESD from "$lib/images/ESD.png";

	const { data } = $props();

	let search = $state<string>("");

	const fuse = new Fuse(data.buildings, {
		keys: ["name", "number"],
	});

	const filteredBuildings = $derived(fuse.search(search));
</script>

<svelte:head>
	<title>knowledger</title>
</svelte:head>

<div class="center-align">
	<div class="space"></div>
	<img width="400px" class="" src={ESD} alt="ESD" />
	<div class="space"></div>
</div>
<h3 class="center-align">Emergency Contacts</h3>

<div class="field label border">
	<input id="input-search" bind:value={search} />
	<label for="input-search">Building Name or Number</label>
	<i>search</i>
</div>

{#each filteredBuildings as building (building.item.number)}
	<BuildingCard building={building.item} />
{/each}

{#if filteredBuildings.length === 0}
	<div class="medium middle-align center-align">
		<div>
			<i class="extra"> domain </i>
			<h5 class="center-align">No buildings found</h5>
			<p class="center-align">Try searching using a building name or number</p>
		</div>
	</div>
{/if}

<style>
	@media (max-width: 600px) {
		img {
			width: 300px;
		}
	}
</style>
