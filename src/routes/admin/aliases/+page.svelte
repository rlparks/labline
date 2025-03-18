<script lang="ts">
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<div class="space"></div>

<div class="center-align">
	<a href="/admin/aliases/create" class="button">
		<i>add</i><span>Create Alias</span>
	</a>
</div>

<div>
	{JSON.stringify(data.aliases)}
</div>
