<script lang="ts">
	import { onMount } from 'svelte';
	import { TableData } from './index.js';
	import Table from './Table.svelte';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

	let res;
	let data: TableData | null = null;
	let dataStranica = [];
	let trenutnaStranica = 0;
	let scale = 1;

	onMount(async () => {
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
			const resolution = res[i].resolution;
			const image = res[i].image;
			data = new TableData({
				columns: columns,
				rows: rows,
				resolution: resolution,
				image: image
			});
			dataStranica[i] = data;
		}
	});
</script>

<div class="h-full w-full flex flex-col">
	<div class="h-[2.5rem]">
		<Navbar bind:scale bind:trenutnaStranica bind:dataStranica />
	</div>
	<div class="basis-auto flex-grow flex-shrink flex flex-row h-[calc(100%-2.5rem)]">
		<div class="basis-auto flex-grow flex-shrink overflow-y-auto w-[10rem]">
			<Sidebar bind:trenutnaStranica {dataStranica} />
		</div>
		<div class="basis-auto w-full flex-grow flex-shrink overflow-clip">
			<Table {data} {dataStranica} bind:scale bind:trenutnaStranica />
		</div>
	</div>
</div>
