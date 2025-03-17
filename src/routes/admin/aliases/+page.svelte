<script lang="ts">
	import { page } from "$app/state";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let create = $derived(page.url.searchParams.get("create"));
</script>

<div class="space"></div>

<div class="center-align">
	<a href="/admin/aliases?create=true" class="button"><i>add</i><span>Create Alias</span></a>
</div>

<div>
	{JSON.stringify(data.aliases)}
</div>

{#if create}
	<div>e</div>
{/if}
