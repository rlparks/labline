<script lang="ts">
	import { UsersTable } from "$lib/components";

	const { data } = $props();

	const title = "Users";
</script>

<svelte:head>
	<title>knowledger · {title}</title>
	<meta name="description" content="User Management admin page for knowledger." />
</svelte:head>

<div class="space"></div>
<div class="center-align">
	<a href="/admin/users/create" class="button square round extra"><i>add</i></a>
</div>

<UsersTable users={data.users} />
