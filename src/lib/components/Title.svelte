<!-- 
@component

The logo and title of the app.
-->

<script lang="ts">
	import icon from "$lib/images/icon/knowledger-128.png";
</script>

<a href="/" data-umami-event="link-home-title">
	<img src={icon} height="40px" alt="knowledger logo" />
	<h4 class="no-margin">knowledger</h4>
</a>

<style>
	img {
		margin-right: 10px;
	}
	h4 {
		font-family: Oswald, sans-serif;
		padding-bottom: 7px;
	}
</style>
