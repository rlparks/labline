<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components";

	let { data } = $props();
</script>

<h3 class="center-align">{data.pageTitle}</h3>

<form method="POST" use:enhance>
	<Input name="username" type="text" autocomplete="off" required label="Username" value="" />
	<Input name="name" type="text" id="name" autocomplete="off" required label="Name" value="" />

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
