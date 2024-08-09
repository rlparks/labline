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
