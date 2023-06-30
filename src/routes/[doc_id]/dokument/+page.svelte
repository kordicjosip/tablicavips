<script lang="ts">
	export let data;
</script>

{#if data.table}
	<table>
		<thead>
			<tr>
				{#each Object.keys(data.table) as header}
					<th>{header}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each Object.values(data.table)[0] as row, i}
				<tr>
					{#each Object.keys(data.table) as header}
						<td>{data.table[header][i].text}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	table {
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid black;
		padding: 2px;
	}

	th {
		background-color: #e0e0e0;
	}
</style>
