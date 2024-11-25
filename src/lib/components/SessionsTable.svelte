<script lang="ts">
	import type { SafeSession } from "$lib/types";

	type Props = {
		sessions: SafeSession[];
	};
	const { sessions }: Props = $props();

	const title = "Sessions · username";
</script>

<svelte:head>
	<title>knowledger · {title}</title>
	<meta name="description" content="knowledger session management." />
</svelte:head>

<h3 class="center-align">{title}</h3>

<table class="stripes center-align">
	<thead>
		<tr>
			<th>Session ID</th>
			<th>Expires At</th>
			<th>IP Address</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each sessions as session}
			<tr>
				<td>{session.id}</td>
				<td>{session.expiresAt}</td>
				<td>{session.ipAddress}</td>
				<td>
					<form method="POST" action={`/admin/users/${session.userId}/sessions?/delete`}>
						<input type="hidden" name="sessionId" value={session.id} />
						<button class="circle" type="submit" data-umami-event="button-delete-session">
							<i>delete</i>
						</button>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
