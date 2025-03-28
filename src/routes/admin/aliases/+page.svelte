<script lang="ts">
	import { AliasTable, Message } from "$lib/components";

	const { data } = $props();
</script>

<div class="space"></div>

<div class="center-align">
	<a href="/admin/aliases/create" class="button">
		<i>add</i><span>Create Alias</span>
	</a>
</div>

{#if data.aliases.length > 0}
	<AliasTable aliases={data.aliases} />
{:else}
	<div class="space"></div>
	<Message
		headerText="No aliases found"
		messageText="Try creating one using the Create Alias button"
		iconText="domain_disabled"
	/>
{/if}
