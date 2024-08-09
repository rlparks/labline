<script lang="ts">
	import { Message } from "$lib/components";

	import { page } from "$app/stores";
</script>

<svelte:head>
	<title>knowledger · {$page.status}</title>
</svelte:head>

{#if $page.status === 401}
	<Message
		iconText="no_accounts"
		headerText="An account is required to access this resource"
		messageText="Try logging in with your UGA account"
	/>
{:else}
	<h3 class="center-align">{$page.status}: {$page.error?.message}</h3>
{/if}
