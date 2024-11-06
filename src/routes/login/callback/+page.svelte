<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { OIDC_STATE_KEY } from "$lib";

	let loading = $state(true);

	let oidcForm: HTMLFormElement;
	let codeInput: HTMLInputElement;

	$effect(() => {
		const code = $page.url.searchParams.get("code");
		const urlState = $page.url.searchParams.get("state");

		if (code && urlState) {
			const savedState = window.sessionStorage.getItem(OIDC_STATE_KEY);
			window.sessionStorage.removeItem(OIDC_STATE_KEY);

			if (savedState === urlState) {
				codeInput.value = code;
				oidcForm.submit();
				loading = false;
			}
		}
	});
</script>

<svelte:head>
	<title>knowledger · SSO Callback</title>
	<meta name="description" content="knowledger OIDC callback page. How did you end up here?" />
</svelte:head>

<h3 class="center-align">OIDC Login</h3>
{#if !$page.error}
	<p class="center-align">Logging in...</p>
{:else}
	<p class="center-align">{$page.error.message}</p>
{/if}

<form bind:this={oidcForm} method="POST" use:enhance>
	<input bind:this={codeInput} name="code" type="hidden" />
</form>
