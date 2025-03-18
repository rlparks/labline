<script lang="ts">
	import type { BuildingAlias } from "$lib/types/entity";

	type Props = {
		aliases: BuildingAlias[];
	};
	const { aliases }: Props = $props();
</script>

<table class="stripes center-align">
	<thead>
		<tr>
			<th>Building Number</th>
			<th>Alias</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each aliases as alias}
			<tr>
				<td>{alias.buildingNumber}</td>
				<td>{alias.alias}</td>
				<td>
					<a class="button circle border" href="/admin/aliases/{alias.id}"><i>edit</i></a>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
