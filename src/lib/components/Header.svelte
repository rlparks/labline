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
	import { Title } from "$lib/components";
	import type { SafeUser } from "$lib/types";

	const NAV_BREAKPOINT = 1020;
	const BUTTON_CIRCLE_BREAKPOINT = 600;

	type Props = {
		user: SafeUser | undefined;
		authEndpoint: URL;
	};

	const { user, authEndpoint }: Props = $props();

	const oidcRedirectUrl = $derived(
		browser ? `${window.location.origin}/login/callback` : undefined,
	);

	function performRedirect() {
		if (authEndpoint && oidcRedirectUrl) {
			authEndpoint.searchParams.set("redirect_uri", oidcRedirectUrl);
			window.location.href = authEndpoint.toString();
		} else {
			alert("Error: Provider not found.");
		}
	}

	let width = $state<number>();
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
			{text}{/if}</a
	>
{/snippet}

<style>
	button {
		margin: 0;
	}
</style>
