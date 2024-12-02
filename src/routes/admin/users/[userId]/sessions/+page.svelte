<script lang="ts">
	import { SessionsTable } from "$lib/components";

	const { data } = $props();

	const title = `Sessions · ${data.editUser.username}`;
</script>

<svelte:head>
	<title>labline · {title}</title>
	<meta name="description" content="labline session management." />
</svelte:head>

<h3 class="center-align">{title}</h3>

<SessionsTable sessions={data.userSessions} currentUserSessionId={data.currentUserSessionId} />
