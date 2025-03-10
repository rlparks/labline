<script lang="ts">
	import { enhance } from "$app/forms";
	import { Message } from "$lib/components";

	const { data } = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>
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
