<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const title = `Edit User · ${data.editUser.username}`;
</script>

<svelte:head>
	<title>knowledger · {title}</title>
	<meta name="description" content="Edit knowledger user." />
</svelte:head>

<h3 class="center-align">{title}</h3>

<form method="POST" action="?/edit" use:enhance>
	<div class="field label border">
		<input
			type="text"
			id="username"
			name="username"
			autocomplete="off"
			value={data.editUser.username}
			required
		/>
		<label for="username">Username</label>
	</div>

	<div class="field label border">
		<input
			type="text"
			id="name"
			name="name"
			autocomplete="off"
			value={data.editUser.name}
			required
		/>
		<label for="name">Name</label>
	</div>

	<div class="field label border">
		<select id="role" name="role">
			{#each data.roles as role}
				<option value={role.value} selected={role.value === data.editUser.role}>{role.name}</option>
			{/each}
		</select>
		<label for="role">Role</label>
	</div>

	<nav>
		<button class="no-margin" type="submit">Save</button>
		<div class="max"></div>
		<a href={`/admin/users/${data.editUser.id}/delete`} class="button border"
			><i>delete</i><span>Delete</span></a
		>
	</nav>
</form>
