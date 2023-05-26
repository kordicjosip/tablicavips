<script lang="ts">
	import { onMount } from 'svelte';
	import { TableData } from './index';
	import Table from './Table.svelte';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

	let res;
	let data: TableData[] = [];
	let trenutnaStranica = null;
	let scale = 1;

	onMount(async () => {
		data = [];
		res = await (await fetch('/data.json')).json();
		for (let i = 0; i < res.length; i++) {
			const columns = res[i].columns.map((column, index) => {
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
			data.push(
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
		if (data.length > 0 && trenutnaStranica === null) {
			trenutnaStranica = 0;
		}
	}
</script>

<div class="h-full w-full flex flex-col">
	<div class="h-[2.5rem]">
		<Navbar bind:scale bind:trenutnaStranica bind:brojStranica={data.length} />
	</div>
	<div class="basis-auto flex-grow flex-shrink flex flex-row h-[calc(100%-2.5rem)]">
		{#if data.length > 0}
			<div class="basis-auto flex-grow flex-shrink overflow-y-auto w-[10rem]">
				<Sidebar bind:trenutnaStranica {data} />
			</div>
			<div class="basis-auto w-full flex-grow flex-shrink overflow-clip">
				{#key data}
					<Table data={data[trenutnaStranica]} bind:scale />
				{/key}
			</div>
		{/if}
	</div>
</div>
