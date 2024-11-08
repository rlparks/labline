<script lang="ts">
	import type { UserWithRole } from "$lib/types";

	type Props = {
		users: UserWithRole[];
	};
	const { users }: Props = $props();
</script>

<table class="stripes center-align">
	<thead>
		<tr>
			<th>Username</th>
			<th>Name</th>
			<th>Role</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			<tr>
				<td>{user.users.username}</td>
				<td>{user.users.name}</td>
				<td>{user.user_roles?.role}</td>
				<td>
					<a class="button circle border" href="/admin/users/{user.users.id}"><i>edit</i></a></td
				>
			</tr>
		{/each}
	</tbody>
</table>
