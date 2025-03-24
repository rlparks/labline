<script lang="ts">
	import { page } from "$app/state";

	const { data, children } = $props();
</script>

<nav class="tabbed">
	{#each data.pages as pageLink}
		<a class:active={page.url.pathname === pageLink.href} href={pageLink.href}>
			<i>{pageLink.icon}</i>
			<span>{pageLink.name}</span>
		</a>
	{/each}
</nav>

{@render children()}
