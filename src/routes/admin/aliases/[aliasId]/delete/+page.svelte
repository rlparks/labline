<script lang="ts">
	import { enhance } from "$app/forms";
	import { Message } from "$lib/components";

	const { data } = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>
<div class="space"></div>
<Message
	messageText="Are you sure you want to delete this alias?"
	headerText=""
	iconText="domain_disabled"
	actionButtons={confirmButtons}
/>

{#snippet confirmButtons()}
	<form method="POST" action={`/admin/aliases/${data.alias.id}?/delete`} use:enhance>
		<button type="submit" data-umami-event="button-alias-delete">
			<i>delete</i><span>Delete</span>
		</button>
	</form>
	<a href={`/admin/aliases/${data.alias.id}`} class="button border">
		<i>cancel</i><span>Cancel</span>
	</a>
{/snippet}
