<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components";

	const { data, form } = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>

{#if form?.message}
	<p class="center-align error-text">{form.message}</p>
{/if}

<form method="POST" action="?/edit" use:enhance>
	<Input
		name="username"
		type="text"
		autocomplete="off"
		value={data.editUser.username}
		label="Username"
		required
	/>

	<Input
		name="name"
		type="text"
		autocomplete="off"
		value={data.editUser.name}
		label="Name"
		required
	/>

	{#if data.showRoles}
		{#each data.roles as role (role.name + role.value)}
			<div>
				<label class="checkbox">
					<input
						name={role.value}
						type="checkbox"
						checked={data.editUser.roles.includes(role.value)}
					/>
					<span>{role.name}</span>
				</label>
				<p class="small-text tiny-margin">{role.description}</p>
			</div>
		{/each}
	{/if}

	<nav>
		<button class="no-margin" type="submit">Save</button>
		<div class="max"></div>
		<a href={`/admin/users/${data.editUser.id}/delete`} class="button border"
			><i>delete</i><span>Delete</span></a
		>
	</nav>
</form>
