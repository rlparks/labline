<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import { OIDC_STATE_KEY } from "$lib";

	let oidcForm: HTMLFormElement;
	let codeInput: HTMLInputElement;

	let paramsError = $state("");

	$effect(() => {
		const code = page.url.searchParams.get("code");
		const urlState = page.url.searchParams.get("state");

		if (code && urlState) {
			const savedState = window.sessionStorage.getItem(OIDC_STATE_KEY);
			window.sessionStorage.removeItem(OIDC_STATE_KEY);

			if (savedState === urlState) {
				codeInput.value = code;
				oidcForm.submit();
			} else {
				paramsError = "Invalid state. Try logging in again?";
			}
		} else {
			paramsError = "No parameters provided. Try logging in again?";
		}
	});
</script>

<h3 class="center-align">OIDC Login</h3>
{#if !page.error && !paramsError}
	<p class="center-align">Logging in...</p>
{:else if page.error}
	<p class="center-align">{page.error.message}</p>
{:else if paramsError}
	<p class="center-align">{paramsError}</p>
{/if}

<form bind:this={oidcForm} method="POST" use:enhance>
	<input bind:this={codeInput} name="code" type="hidden" />
</form>
