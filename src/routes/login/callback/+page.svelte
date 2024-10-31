<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { PROVIDER_KEY } from "$lib";
	import type { AuthProviderInfo } from "pocketbase";

	let loading = $state(true);

	let provider: AuthProviderInfo | undefined = $state();
	let code: string | undefined = $derived($page.url.searchParams.get("code") ?? "");

	$effect(() => {
		const providerString: string | null = window.sessionStorage.getItem(PROVIDER_KEY);
		if (providerString) {
			provider = JSON.parse(providerString);
			window.sessionStorage.removeItem(PROVIDER_KEY);
		}

		const params = $page.url.searchParams;

		if (!provider || provider.state !== params.get("state")) {
			// provider from session storage doesn't exist
			// or state param doesn't match
			goto("/");
		} else {
			// login
			document.getElementById("providerInput")?.setAttribute("value", JSON.stringify(provider));
			document.getElementById("codeInput")?.setAttribute("value", code);
			(document.getElementById("oidcLogin") as HTMLFormElement)?.submit();
		}
	});
</script>

<svelte:head>
	<title>knowledger · SSO Callback</title>
	<meta name="description" content="knowledger OIDC callback page. How did you end up here?" />
</svelte:head>

<h3 class="center-align">OIDC Login</h3>
{#if loading}
	<p class="center-align">Logging in...</p>
{:else}
	<p class="center-align">Failed to login. Please try again.</p>
{/if}

<form id="oidcLogin" action="/api/auth/login/oidc" method="POST" use:enhance>
	<input id="providerInput" name="provider" type="hidden" />
	<input id="codeInput" name="code" type="hidden" />
</form>
