<script lang="ts">
	import { SessionsTable } from "$lib/components";

	const { data } = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>

<SessionsTable sessions={data.userSessions} currentUserSessionId={data.currentUserSessionId} />
