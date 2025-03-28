<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components";

	const { data, form } = $props();

	let buildingNumber = $state(data.alias.buildingNumber);
	let matchingBuilding = $derived(
		data.buildings.find((building) => building.number === buildingNumber),
	);
</script>

<h3 class="center-align">{data.pageTitle}</h3>

{#if form?.message}
	<p class="center-align error-text">{form.message}</p>
{/if}

<div class="chip">
	<i>domain</i>
	<span>{matchingBuilding?.name ?? "No building match"}</span>
</div>

<form method="POST" action="?/edit" use:enhance>
	<input name="id" value={data.alias.id} hidden />

	<Input
		name="buildingNumber"
		type="text"
		autocomplete="off"
		bind:value={buildingNumber}
		label="Building Number"
		required
	/>

	<Input
		name="alias"
		type="text"
		autocomplete="off"
		value={data.alias.alias}
		label="Alias"
		required
	/>

	<nav>
		<button class="no-margin" type="submit">Save</button>
		<div class="max"></div>
		<a href={`/admin/aliases/${data.alias.id}/delete`} class="button border">
			<i>delete</i><span>Delete</span>
		</a>
	</nav>
</form>
