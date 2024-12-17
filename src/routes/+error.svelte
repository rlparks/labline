<script lang="ts">
	import { Message } from "$lib/components";

	import { page } from "$app/state";
</script>

<svelte:head>
	<title>labline · {page.status}</title>
</svelte:head>

{#if page.status === 401}
	<Message
		iconText="no_accounts"
		headerText="An account is required to access this resource"
		messageText="Try logging in with your UGA account"
	/>
{:else}
	<Message
		iconText="error"
		headerText="{page.status}: {page.error?.message}"
		messageText="Sorry, an error has occurred."
	/>
{/if}
