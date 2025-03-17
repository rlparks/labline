<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { Input } from "$lib/components";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let create = page.url.searchParams.get("create");

	function keyHandler(event: KeyboardEvent) {
		if (event.repeat || event.key !== "Escape") {
			return;
		}
		// key is escape
		goto("/admin/aliases");
	}
</script>

<svelte:body onkeydown={keyHandler} />

<div class="space"></div>

<div class="center-align">
	<a href="/admin/aliases?create=true" data-sveltekit-noscroll class="button">
		<i>add</i><span>Create Alias</span>
	</a>
</div>

<div>
	{JSON.stringify(data.aliases)}
</div>

{#if create}
	<dialog class="active">
		<form action="?/create" method="POST" use:enhance>
			<Input
				name="buildingNumber"
				type="text"
				autocomplete="off"
				required
				label="Building Number"
			/>
			<Input name="alias" type="text" id="name" autocomplete="off" required label="Alias" />

			<button class="no-margin" type="submit" data-umami-event="button-create-alias">Create</button>
		</form>
	</dialog>
{/if}
