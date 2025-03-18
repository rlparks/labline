<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components";

	let { data, form } = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>

<p class="center-align error-text">{form?.message}</p>

<form method="POST" action="?/edit" use:enhance>
	<input name="id" value={data.alias.id} hidden />

	<Input
		name="buildingNumber"
		type="text"
		autocomplete="off"
		value={data.alias.buildingNumber}
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
		<a href={`/admin/aliases/${data.alias.id}/delete`} class="button border"
			><i>delete</i><span>Delete</span></a
		>
	</nav>
</form>
