<script lang="ts">
	const { data } = $props();

	const title = "Summary";

	const stats = {
		labsWithBothContacts: 0,
		labsWithOnlyPrimaryContact: 0,
		labsWithOnlySecondaryContact: 0,
		labsWithNoContact: 0,
	};
	for (const lab of data.labs) {
		const primaryContact = lab["Primary Contact"];
		const secondaryContact = lab["Secondary Contact"];

		if (contactIsValid(primaryContact) && contactIsValid(secondaryContact)) {
			stats.labsWithBothContacts++;
		} else if (contactIsValid(primaryContact)) {
			stats.labsWithOnlyPrimaryContact++;
		} else if (contactIsValid(secondaryContact)) {
			stats.labsWithOnlySecondaryContact++;
		} else {
			stats.labsWithNoContact++;
		}
	}

	function contactIsValid(contact: string) {
		return contact && contact !== "-";
	}

	function getPercentOfTotalLabs(num: number) {
		return `${((num / data.labs.length) * 100).toFixed(2)}%`;
	}
</script>

<svelte:head>
	<title>knowledger · {title}</title>
</svelte:head>

<h3 class="center-align">{title}</h3>

<div class="center-align">
	<p>Number of buildings: {data.buildings.length}</p>
	<p>Number of labs: {data.labs.length}</p>

	<p>
		Number of labs with both contacts: {stats.labsWithBothContacts} ({getPercentOfTotalLabs(
			stats.labsWithBothContacts,
		)})
	</p>
	<p>
		Number of labs with only primary contact: {stats.labsWithOnlyPrimaryContact} ({getPercentOfTotalLabs(
			stats.labsWithOnlyPrimaryContact,
		)})
	</p>
	<p>
		Number of labs with only secondary contact: {stats.labsWithOnlySecondaryContact} ({getPercentOfTotalLabs(
			stats.labsWithOnlySecondaryContact,
		)})
	</p>
	<p>
		Number of labs with no contact: {stats.labsWithNoContact} ({getPercentOfTotalLabs(
			stats.labsWithNoContact,
		)})
	</p>
</div>
