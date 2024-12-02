<!-- 
@component

The logo and title of the app.
-->

<script lang="ts">
	import icon from "$lib/images/icon/labline-128.png";
</script>

<a href="/">
	<img src={icon} height="40px" alt="labline logo" />
	<h4 class="no-margin">labline</h4>
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
