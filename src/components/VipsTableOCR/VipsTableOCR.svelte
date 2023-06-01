<script lang="ts">
	import { onMount } from 'svelte';
	import { TableData, TablesData } from './index';
	import Table from './Table.svelte';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

	let res;
	let data: TablesData = new TablesData();
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
	function addRow(event) {
		data.addRow(event.detail);
		data = data;
	}
	function removeRow(event) {
		data.removeRow(event.detail);
		data = data;
	}
	function addColumn(event) {
		data.addColumn(event.detail);
		data = data;
	}
	function removeColumn(event) {
		data.removeColumn(event.detail);
		data = data;
	}

	function renameColumn(event) {
		data.renameColumn(event.detail.id, event.detail.newName);
		data = data;
	}
</script>

<div class="h-full w-full flex flex-col">
	<div class="h-[2.5rem]">
		<Navbar
			bind:brojStranica={data.tables.length}
			bind:scale
			bind:trenutnaStranica={data.trenutnaStranica}
			on:toggleOtkljucaj={(event) => (data.trenutnaStranicaTable.otkljucana = event.detail)}
			otkljucana={data.trenutnaStranicaTable?.otkljucana}
		/>
	</div>
	<div class="basis-auto flex-grow flex-shrink flex flex-row h-[calc(100%-2.5rem)]">
		{#if data.tables.length > 0}
			<div class="basis-auto flex-grow flex-shrink overflow-y-auto w-[10rem]">
				<Sidebar bind:trenutnaStranica={data.trenutnaStranica} data={data.tables} />
			</div>
			<div class="basis-auto w-full flex-grow flex-shrink overflow-clip">
				{#key data.tables}
					<Table
						on:addRow={addRow}
						on:removeRow={removeRow}
						on:addColumn={addColumn}
						on:removeColumn={removeColumn}
						on:renameColumn={renameColumn}
						data={data.trenutnaStranicaTable}
						tablesData={data}
						bind:scale
					/>
				{/key}
			</div>
		{/if}
	</div>
</div>
