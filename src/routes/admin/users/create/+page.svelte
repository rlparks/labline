<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";

	const title = "Create User";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>knowledger · {title}</title>
	<meta name="description" content="Create new knowledger user." />
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

	<div class="field label border">
		<select id="role" name="role">
			{#each data.roles as role}
				<option value={role.value}>{role.name}</option>
			{/each}
		</select>
		<label for="role">Role</label>
	</div>

	<button type="submit" data-umami-event="button-create-user">Create</button>
</form>
