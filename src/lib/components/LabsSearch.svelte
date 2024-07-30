<script lang="ts">
	import { getLabFuse } from "$lib";
	import LabCard from "$lib/components/LabCard.svelte";
	import type { Lab } from "$lib/types/index.js";

	type Props = {
		labs: Lab[];
		title: string;
		showLabsWhenNoSearch: boolean;
		showBuildingNames: boolean;
	};
	const { labs, title, showLabsWhenNoSearch, showBuildingNames }: Props = $props();

	let search = $state<string>("");

	const fuse = getLabFuse(labs);

	const filteredLabs = $derived(fuse.search<Lab>(search, { limit: 300 }));
	const count = $derived(search ? filteredLabs.length : labs.length);
</script>

{#if labs[0]}
	<h3 class="center-align">{title}</h3>
	<h5 class="center-align">{count === 1 ? "1 lab" : `${count} labs`}</h5>
	<div class="field label border">
		<input id="input-search-labs" bind:value={search} />
		<label for="input-search-labs">Lab Name, Room Number, or Super or PI Name</label>
		<i>search</i>
	</div>
{/if}

{#if !search}
	{#if showLabsWhenNoSearch}
		{#each labs as lab (lab["Lab Name"] + lab["Bldg Number"])}
			<LabCard {lab} showBuildingName={showBuildingNames} />
		{/each}
	{:else}
		<div class="medium middle-align center-align">
			<div>
				<i class="extra"> experiment </i>
				<h5 class="center-align">No labs found</h5>
				<p class="center-align">
					Try searching using a lab name, room number, or the name of the supervisor or PI
				</p>
			</div>
		</div>
	{/if}
{:else}
	{#each filteredLabs as lab (lab.item["Lab Name"] + lab.item["Bldg Number"])}
		<LabCard lab={lab.item} showBuildingName={showBuildingNames} />
	{/each}
{/if}
