<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";

	const title = "Create User";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>labline · {title}</title>
	<meta name="description" content="Create new labline user." />
</svelte:head>

<h3 class="center-align">{title}</h3>

<form method="POST" use:enhance>
	<div class="field label border">
		<input type="text" id="username" name="username" autocomplete="off" required />
		<label for="username">Username</label>
	</div>

	<div class="field label border">
		<input type="text" id="name" name="name" autocomplete="off" required />
		<label for="name">Name</label>
	</div>

	<div class="field">
		{#each data.roles as role}
			<div>
				<label class="checkbox">
					<input name={role.value} type="checkbox" />
					<span>{role.name}</span>
				</label>
			</div>
		{/each}
	</div>

	<button class="no-margin" type="submit" data-umami-event="button-create-user">Create</button>
</form>
