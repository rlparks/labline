<script lang="ts">
	import { Message } from "$lib/components";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	import { enhance } from "$app/forms";

	const title = `Delete User · ${data.editUser.username}`;
</script>

<svelte:head>
	<title>labline · {title}</title>
	<meta name="description" content="Delete labline user." />
</svelte:head>

<h3 class="center-align">{title}</h3>
<div class="space"></div>
<Message
	messageText="Are you sure you want to delete this user?"
	headerText=""
	iconText="person_off"
	actionButtons={confirmButtons}
/>

{#snippet confirmButtons()}
	<form method="POST" action={`/admin/users/${data.editUser.id}?/delete`} use:enhance>
		<button type="submit" data-umami-event="button-delete"><i>delete</i><span>Delete</span></button>
	</form>
	<a href={`/admin/users/${data.editUser.id}`} class="button border"
		><i>cancel</i><span>Cancel</span></a
	>
{/snippet}
