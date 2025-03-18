<script lang="ts">
	import { AliasTable } from "$lib/components";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<div class="space"></div>

<div class="center-align">
	<a href="/admin/aliases/create" class="button">
		<i>add</i><span>Create Alias</span>
	</a>
</div>

<AliasTable aliases={data.aliases} />
