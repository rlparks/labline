<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components";

	let { data, form } = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>

{#if form?.message}
	<p class="center-align error-text">{form.message}</p>
{/if}

<form method="POST" use:enhance>
	<Input name="username" type="text" autocomplete="off" required label="Username" />
	<Input name="name" type="text" id="name" autocomplete="off" required label="Name" />

	{#if data.showRoles}
		{#each data.roles as role}
			<div>
				<label class="checkbox">
					<input name={role.value} type="checkbox" />
					<span>
						{role.name}
					</span>
				</label>
				<p class="small-text tiny-margin">{role.description}</p>
			</div>
		{/each}
	{/if}
	<div class="space"></div>
	<button class="no-margin" type="submit" data-umami-event="button-create-user">Create</button>
</form>
