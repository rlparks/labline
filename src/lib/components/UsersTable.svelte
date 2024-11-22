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
			<th>Sessions</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			{@const numSessions = 0}
			<tr>
				<td>{user.username}</td>
				<td>{user.name}</td>
				<td>{user?.role}</td>
				<td>
					<a
						class="button circle"
						class:border={numSessions === 0}
						href="/admin/users/{user.id}/sessions">{numSessions}</a
					>
				</td>
				<td><a class="button circle border" href="/admin/users/{user.id}"><i>edit</i></a></td>
			</tr>
		{/each}
	</tbody>
</table>
