<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	const title = `Edit User · ${data.editUser.username}`;
</script>

<svelte:head>
	<title>labline · {title}</title>
	<meta name="description" content="Edit labline user." />
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

	{#if data.showRoles}
		<div class="field">
			{#each data.roles as role}
				<div>
					<label class="checkbox">
						<input
							name={role.value}
							type="checkbox"
							checked={data.editUser.roles.includes(role.value)}
						/>
						<span>{role.name}</span>
					</label>
				</div>
			{/each}
		</div>
	{/if}

	<nav>
		<button class="no-margin" type="submit">Save</button>
		<div class="max"></div>
		<a href={`/admin/users/${data.editUser.id}/delete`} class="button border"
			><i>delete</i><span>Delete</span></a
		>
	</nav>
</form>
