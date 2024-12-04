<script lang="ts">
	import type { UserWithRoles } from "$lib/types";

	type Props = {
		users: UserWithRoles[];
		sessionCount: Map<string, number>;
	};
	const { users, sessionCount }: Props = $props();
</script>

<table class="stripes center-align">
	<thead>
		<tr>
			<th>Username</th>
			<th>Name</th>
			<th>Roles</th>
			<th>Sessions</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			{@const numSessions = sessionCount.get(user.id) ?? 0}
			<tr>
				<td>{user.username}</td>
				<td>{user.name}</td>
				<td>{user.roles.join(", ")}</td>
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
