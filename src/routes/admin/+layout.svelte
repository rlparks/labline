<script lang="ts">
	import { page } from "$app/state";

	const { children } = $props();

	const pages = [
		{
			name: "Users",
			href: "/admin/users",
			icon: "person",
		},
		{
			name: "Building Aliases",
			href: "/admin/aliases",
			icon: "menu_open",
		},
	];
</script>

<nav class="tabbed">
	{#each pages as pageLink}
		<a class:active={page.url.pathname === pageLink.href} href={pageLink.href}>
			<i>{pageLink.icon}</i>
			<span>{pageLink.name}</span>
		</a>
	{/each}
</nav>

{@render children()}
