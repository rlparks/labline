<!-- 
@component

An informative message displayed to the user. The text is centered, with
a Material Design icon displayed above the text.

## Props
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `iconText` | `string` | Required | The icon name - see https://fonts.google.com/icons. |
| `headerText` | `string` | Required | The text of the header. |
| `messageText` | `string` | Required | The text of the message. |

## Example

```svelte
<Message
    iconText="no_accounts"
    headerText="An account is required to access this resource"
    messageText="Try logging in with your account"
/>
```
-->

<script lang="ts">
	type Props = {
		iconText: string;
		headerText: string;
		messageText: string;
	};

	const { iconText, headerText, messageText }: Props = $props();
</script>

<div class="medium middle-align center-align">
	<div>
		<i class="extra">{iconText}</i>
		<h5 class="center-align">{headerText}</h5>
		<p class="center-align">{messageText}</p>
	</div>
</div>

<style>
	h5 {
		text-wrap: balance;
	}
</style>
