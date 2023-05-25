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
	$: {
		scale < 0 ? (scale = 0.01) : scale;
		scale > 2.5 ? (scale = 2.5) : scale;
		trenutnaStranica < 0 ? (trenutnaStranica = 0) : trenutnaStranica;
		trenutnaStranica >= dataStranica.length ? (trenutnaStranica = 0) : dataStranica.length;
	}

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
	<Navbar bind:scale bind:trenutnaStranica {dataStranica} />
	<div class="flex flex-row flex-grow-0">
		<Sidebar bind:trenutnaStranica {dataStranica} />
		<Table {data} {dataStranica} bind:scale bind:trenutnaStranica />
	</div>
</div>

<style>
</style>
