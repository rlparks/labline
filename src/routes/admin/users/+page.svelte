<script lang="ts">
	import { UsersTable } from "$lib/components";

	const { data } = $props();

	const title = "Users";
</script>

<svelte:head>
	<title>labline · {title}</title>
	<meta name="description" content="User Management admin page for labline." />
</svelte:head>

<div class="absolute bottom right">
	<a href="/admin/users/create" class="button square round extra"><i>add</i></a>
</div>

<UsersTable users={data.users} sessionCount={data.sessionCount} />
