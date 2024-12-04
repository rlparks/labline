<script lang="ts">
	import type { UserWithRoles } from "$lib/types";

	type Props = {
		users: UserWithRoles[];
		sessionCount: Map<string, number> | undefined;
	};
	const { users, sessionCount }: Props = $props();
</script>

<table class="stripes center-align">
	<thead>
		<tr>
			<th>Username</th>
			<th>Name</th>
			<th>Roles</th>
			{#if sessionCount}
				<th>Sessions</th>
			{/if}
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each users as user}
			<tr>
				<td>{user.username}</td>
				<td>{user.name}</td>
				<td>{user.roles.join(", ")}</td>
				{#if sessionCount}
					{@const numSessions = sessionCount.get(user.id) ?? 0}
					<td>
						<a
							class="button circle"
							class:border={numSessions === 0}
							href="/admin/users/{user.id}/sessions">{numSessions}</a
						>
					</td>
				{/if}
				<td><a class="button circle border" href="/admin/users/{user.id}"><i>edit</i></a></td>
			</tr>
		{/each}
	</tbody>
</table>
