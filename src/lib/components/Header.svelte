<!-- 
@component

The header (navigation bar) of the application.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `SafeUser \| undefined` | Required | The current user, displayed in the header. |
| `provider` | `AuthProviderInfo \| undefined` | Required | The provider to use for OIDC login. |

## Example

```svelte
<Header {user} {provider} />
```

-->

<script lang="ts">
	import { browser } from "$app/environment";
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import { OIDC_STATE_KEY } from "$lib";
	import { Title } from "$lib/components";
	import type { SafeUser, AuthInfo } from "$lib/types";

	const NAV_BREAKPOINT = 1020;
	const BUTTON_CIRCLE_BREAKPOINT = 600;

	type Props = {
		user: SafeUser | null;
		authInfo: AuthInfo;
	};

	const { user, authInfo }: Props = $props();

	const oidcRedirectUrl = $derived(
		browser ? `${window.location.origin}/login/callback` : undefined,
	);

	function performRedirect() {
		if (authInfo.authEndpoint && oidcRedirectUrl) {
			window.sessionStorage.setItem(OIDC_STATE_KEY, authInfo.state);

			const authEndpointUrl = new URL(authInfo.authEndpoint);
			authEndpointUrl.searchParams.set("redirect_uri", oidcRedirectUrl);
			window.location.href = authEndpointUrl.toString();
		} else {
			alert("Error: Provider not found.");
		}
	}

	let width = $state<number>(NAV_BREAKPOINT + 1);
</script>

<svelte:window bind:innerWidth={width} />

<header>
	<nav>
		<Title />
		{#if user && width && width > NAV_BREAKPOINT}
			{@render navButtons()}
		{/if}
		<div class="max"></div>
		{#if user}
			<span>{user.username}</span>
			<form action="/api/auth/logout" method="POST" use:enhance>
				<button
					type="submit"
					class:circle={width && width <= BUTTON_CIRCLE_BREAKPOINT}
					data-umami-event="button-logout"
					data-umami-event-username={user.username}
				>
					<i>logout</i>
					<span>Logout</span>
				</button>
			</form>
		{:else}
			<button onclick={performRedirect} data-umami-event="button-login">
				<i>login</i><span>Login</span></button
			>
		{/if}
	</nav>

	{#if user && width && width <= NAV_BREAKPOINT}
		<div class="row center-align no-margin">
			{@render navButtons()}
		</div>
	{/if}
</header>

{#snippet navButtons()}
	{@render navButton("/", "domain", "Search by Building")}
	{@render navButton("/labs", "experiment", "Search All Labs")}
	{@render navButton("/summary", "list", "Summary")}
{/snippet}

{#snippet navButton(url: string, icon: string, text: string)}
	<a
		class="button"
		class:border={$page.url.pathname !== url}
		class:circle={width && width <= BUTTON_CIRCLE_BREAKPOINT && $page.url.pathname !== url}
		href={url}
		><i>{icon}</i>
		{#if (width && width > BUTTON_CIRCLE_BREAKPOINT) || $page.url.pathname === url}
			<span>{text}</span>{/if}</a
	>
{/snippet}

<style>
	button {
		margin: 0;
	}
</style>
