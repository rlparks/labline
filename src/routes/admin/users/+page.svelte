<script lang="ts">
	import { UsersTable } from "$lib/components";

	const { data } = $props();

	const title = "Users";
</script>

<svelte:head>
	<title>knowledger · {title}</title>
	<meta name="description" content="User Management admin page for knowledger." />
</svelte:head>

<h3 class="center-align">{title}</h3>

<UsersTable users={data.users} />
