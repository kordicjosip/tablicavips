<script lang="ts">
	import { onMount } from 'svelte';
	import { TableData, TablesData } from './index';
	import Table from './Table.svelte';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

	let res;
	let data: TablesData = new TablesData();
	let trenutnaStranica = null;
	let scale = 1;

	onMount(async () => {
		res = await (await fetch('/data.json')).json();
		for (let i = 0; i < res.length; i++) {
			const columns = res[0].columns.map((column, index) => {
				return {
					id: index,
					name: 'column',
					x1: column[0],
					x2: column[1],
					get width() {
						return this.x2 - this.x1;
					}
				};
			});
			const rows = res[i].rows.map((row, index) => {
				return {
					id: index,
					name: 'row',
					y1: row[0],
					y2: row[1]
				};
			});

			data.addTable(
				new TableData({
					columns: columns,
					rows: rows,
					resolution: res[i].resolution,
					image: res[i].image
				})
			);
		}
		data = data;
	});

	$: {
		if (data.tables.length > 0 && trenutnaStranica === null) {
			trenutnaStranica = 0;
		}
	}
</script>

<div class="h-full w-full flex flex-col">
	<div class="h-[2.5rem]">
		<Navbar
			bind:brojStranica={data.tables.length}
			bind:scale
			bind:trenutnaStranica
			on:toggleOtkljucaj={(event) => (data.tables[trenutnaStranica].otkljucana = event.detail)}
			otkljucana={data.tables[trenutnaStranica]?.otkljucana}
		/>
	</div>
	<div class="basis-auto flex-grow flex-shrink flex flex-row h-[calc(100%-2.5rem)]">
		{#if data.tables.length > 0}
			<div class="basis-auto flex-grow flex-shrink overflow-y-auto w-[10rem]">
				<Sidebar bind:trenutnaStranica data={data.tables} />
			</div>
			<div class="basis-auto w-full flex-grow flex-shrink overflow-clip">
				{#key data.tables}
					<Table data={data.tables[trenutnaStranica]} bind:scale />
				{/key}
			</div>
		{/if}
	</div>
</div>
