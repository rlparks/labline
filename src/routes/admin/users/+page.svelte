<script lang="ts">
	import { UsersTable } from "$lib/components";

	const { data } = $props();
</script>

<div class="space"></div>

<div class="center-align">
	<a href="/admin/users/create" class="button"><i>add</i><span>Create User</span></a>
</div>

<UsersTable users={data.users} sessionCount={data.sessionCount} />
