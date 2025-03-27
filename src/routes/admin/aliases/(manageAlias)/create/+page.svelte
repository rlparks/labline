<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components";
	import type { PageProps } from "./$types";

	let { data, form }: PageProps = $props();

	let buildingNumber = $state("");
	let matchingBuilding = $derived(
		data.buildings.find((building) => building.number === buildingNumber),
	);
</script>

<h3 class="center-align">{data.pageTitle}</h3>

<p class="center-align error-text">{form?.message}</p>

<div class="chip">
	<i>domain</i>
	<span>{matchingBuilding?.name ?? "No building match"}</span>
</div>

<form method="POST" use:enhance>
	<Input
		name="buildingNumber"
		type="text"
		autocomplete="off"
		required
		label="Building Number"
		bind:value={buildingNumber}
	/>

	<Input name="alias" type="text" id="name" autocomplete="off" required label="Alias" />

	<button class="no-margin" type="submit" data-umami-event="button-create-alias">Create</button>
</form>
