<script lang="ts">
	import { page } from "$app/stores";

	const { children } = $props();

	const pages = [
		{
			name: "Users",
			href: "/admin/users",
			icon: "person",
		},
		{
			name: "Sessions",
			href: "/admin/sessions",
			icon: "lock",
		},
	];
</script>

<nav class="tabbed">
	{#each pages as pageLink}
		<a class:active={$page.url.pathname === pageLink.href} href={pageLink.href}>
			<i>{pageLink.icon}</i>
			<span>{pageLink.name}</span>
		</a>
	{/each}
</nav>

{@render children()}
