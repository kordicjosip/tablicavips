<script lang="ts">
	import {
		COLUMN_HEADER_HEIGHT,
		ROW_HEADER_WIDTH,
		DataTableData,
		type DataTableRowInterface,
		type DataTableColumnInterface
	} from './index.ts';
	import '../../app.css';
	import RowHeader from '../../components/DataTable/RowHeader.svelte';
	import ColumnHeader from '../../components/DataTable/ColumnHeader.svelte';
	import DataTableCorner from '../../components/DataTable/DataTableCorner.svelte';
	import ColumnHeaderDivider from '../../components/DataTable/ColumnHeaderDivider.svelte';
	import RowHeaderDivider from '../../components/DataTable/RowHeaderDivider.svelte';
	import { onMount } from 'svelte';
	import {
		ContextMenu,
		ContextMenuDefinition,
		ContextMenuEntry,
		ContextMenuGroup
	} from '../../components/ContextMenu';
	import ColumnHeaderBackground from './ColumnHeaderBackground.svelte';
	import RowHeaderBackground from './RowHeaderBackground.svelte';
	import RowHeaderDividerLine from './RowHeaderDividerLine.svelte';
	import ColumnHeaderDividerLine from './ColumnHeaderDividerLine.svelte';

	export let show_column_header = true;
	export let show_row_header = true;

	const X0 = show_row_header ? ROW_HEADER_WIDTH : 0;
	const Y0 = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
	let X = show_row_header ? ROW_HEADER_WIDTH : 0;
	let Y = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
	let res = [];
	let data: DataTableData | null = null;
	let trenutnaStranica: null | number = 0;

	let scaleW = 0;
	let scaleH = 0;
	let scale = 1;

	let contextMenuDefinition = new ContextMenuDefinition();
	let elContextMenu = new ContextMenuGroup('Context menu za redove');
	let cmX = 0;
	let cmY = 0;
	let cmShow = false;

	function showContextMenuRows(event: PointerEvent, row: DataTableRowInterface) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		console.log(scrollY);
		elContextMenu.entries.push(
			new ContextMenuEntry('Dodaj red', 'ico', () => {
				data?.addRow({
					id: Number(data?.rows.length),
					name: 'row',
					y1: cmY - Y - 15,
					y2: cmY - Y + 15
				});
				data = data;
			}),
			new ContextMenuEntry('Obriši red', 'ico', () => {
				data?.removeRow(row);
				data = data;
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function showContextMenuCols(event: PointerEvent, column: DataTableColumnInterface) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Dodaj stupac', 'ico', () => {
				data?.addColumn({
					id: Number(data?.rows.length),
					name: 'column',
					x1: cmX - X - 25,
					x2: cmX - X + 25
				});
				data = data;
			}),
			new ContextMenuEntry('Obriši stupac', 'ico', () => {
				data?.removeColumn(column);
				data = data;
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function showContextMenuRowsBg(event: PointerEvent) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Dodaj red', 'ico', () => {
				data?.addRow({
					id: Number(data?.rows.length),
					name: 'row',
					y1: cmY - Y - 15,
					y2: cmY - Y + 15
				});
				data = data;
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function showContextMenuColsBg(event: PointerEvent) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Dodaj stupac', 'ico', () => {
				data?.addColumn({
					id: Number(data?.rows.length),
					name: 'column',
					x1: cmX - X - 25,
					x2: cmX - X + 25
				});
				data = data;
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function hideContextMenu() {
		cmShow = false;
	}

	onMount(async () => {
		res = await (await fetch('/data.json')).json();
		const columns = res[trenutnaStranica].columns.map((column, index) => {
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
		const rows = res[trenutnaStranica].rows.map((row, index) => {
			return {
				id: index,
				name: 'row',
				y1: row[0],
				y2: row[1]
			};
		});
		const resolution = res[trenutnaStranica].resolution;
		const image = res[trenutnaStranica].image;
		data = new DataTableData({
			columns: columns,
			rows: rows,
			resolution: resolution,
			image: image
		});

		window.addEventListener('resize', () => {
			hideContextMenu();
		});

		document.addEventListener('click', () => {
			if (cmShow == true) {
				setTimeout(() => {
					hideContextMenu();
				}, 50);
			}
		});

		document.getElementById('table').addEventListener('mousewheel', (event: WheelEvent) => {
			hideContextMenu();

			if (event.shiftKey) {
				// noinspection JSSuspiciousNameCombination
				Y -= event.deltaX;
				// noinspection JSSuspiciousNameCombination
				X -= event.deltaY;
			} else {
				Y -= event.deltaY;
				X -= event.deltaX;
			}
			if (X > X0) X = X0;
			if (Y > Y0) Y = Y0;
		});
	});

	$: {
		if (data) scale = scaleW / data.resolution[0];
	}
</script>

<div class="h-full overflow-clip" bind:clientWidth={scaleW} bind:clientHeight={scaleH}>
	<button on:click={() => (scale = scale - 0.05)} class="absolute right-8 top-8 w-6 bg-fuchsia-300"
		>-</button
	>
	<button on:click={() => (scale = scale + 0.05)} class="absolute right-1 top-8 w-6 bg-fuchsia-300"
		>+</button
	>

	<svg width="{data? data.resolution[0] * scale : 0}px" height="{data? data.resolution[1] * scale : 0}px" id="table" viewBox="0 0 {data? data.resolution[0]: 0} {data? data.resolution[1]: 0}">
		{#if data}
			<image
				href={data.image}
				width={data.resolution[0]}
				height={data.resolution[1]}
				transform="translate({X/scale} {Y/scale})"
			/>

			<g transform="translate({X/scale} {Y/scale})">
				{#each data.rows as row}
					<RowHeaderDividerLine bind:row bind:scale={scale} width={data.resolution[0]} />
				{/each}
			</g>

			<g transform="translate({X/scale} {Y/scale})">
				{#each data.columns as column}
					<ColumnHeaderDividerLine bind:column bind:scale={scale} height={data.resolution[1]} />
				{/each}
			</g>

			<g transform="translate(0 {Y/scale})">
				<RowHeaderBackground
					onRightClick={showContextMenuRowsBg}
					bind:scale={scale}
					height={data.resolution[1]}
				/>
				{#each data.rows as row}
					<RowHeader bind:row bind:scale={scale} onRightClick={showContextMenuRows} />
				{/each}
			</g>

			<g transform="translate(0 {Y/scale})">
				{#each data.rows as row}
					<RowHeaderDivider bind:row bind:scale={scale} width={X0} />
				{/each}
			</g>

			<g transform="translate({X/scale} 0)">
				<ColumnHeaderBackground
					onRightClick={showContextMenuColsBg}
					width={data.resolution[0]}
					bind:scale={scale}
				/>
				{#each data.columns as column}
					<ColumnHeader bind:column bind:scale={scale} onRightClick={showContextMenuCols} />
				{/each}
			</g>

			<g transform="translate({X/scale} 0)">
				{#each data.columns as column}
					<ColumnHeaderDivider bind:column bind:scale={scale} height={Y0} />
				{/each}
			</g>

			<DataTableCorner height={Y0 / scale} width={X0 / scale} x={0} y={0} />
		{/if}
	</svg>
</div>

<ContextMenu definition={contextMenuDefinition} visible={cmShow} x={cmX} y={cmY} />
