<script lang="ts">
	import { enhance } from "$app/forms";
	import { getFormattedDateTime } from "$lib";
	import type { SafeSession } from "$lib/types/entity";

	type Props = {
		sessions: SafeSession[];
		currentUserSessionId: string;
	};
	const { sessions, currentUserSessionId }: Props = $props();
</script>

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
		{#each sessions as session (session.id)}
			<tr>
				<td>{session.id}</td>
				<!-- slightly cheating with types here -->
				<td>{getFormattedDateTime(new Date(session.expiresAt))}</td>
				<td>{session.ipAddress}</td>
				<td>
					<form
						method="POST"
						action={`/admin/users/${session.userId}/sessions?/delete`}
						use:enhance
					>
						{#if session.id === currentUserSessionId}
							<div class="chip">
								<i>warning</i>
								<div class="tooltip">Your Current Session</div>
							</div>
						{/if}

						<input type="hidden" name="sessionId" value={session.id} />
						<button
							class="circle"
							type="submit"
							data-umami-event="button-delete-session"
							title="Instantly deletes session without confirmation!"
						>
							<i>delete</i>
						</button>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
