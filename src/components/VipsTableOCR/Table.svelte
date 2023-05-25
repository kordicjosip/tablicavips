<script lang="ts">
	import {
		COLUMN_HEADER_HEIGHT,
		ROW_HEADER_WIDTH,
		TableData,
		type TableRowInterface,
		type TableColumnInterface
	} from './index.ts';
	import '../../app.css';
	import RowHeader from './/RowHeader.svelte';
	import ColumnHeader from './/ColumnHeader.svelte';
	import Corner from './Corner.svelte';
	import ColumnHeaderDivider from './/ColumnHeaderDivider.svelte';
	import RowHeaderDivider from './/RowHeaderDivider.svelte';
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
	export let data: TableData | null = null;
	export let dataStranica = [];
	export let trenutnaStranica: null | number = 0;
	export let scale = 1;

	let scaleW = 0;
	let scaleH = 0;

	let contextMenuDefinition = new ContextMenuDefinition();
	let elContextMenu = new ContextMenuGroup('Context menu za redove');
	let cmX = 0;
	let cmY = 0;
	let cmShow = false;

	function showContextMenuRows(event: PointerEvent, row: TableRowInterface) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Dodaj red', 'ico', () => {
				dataStranica[trenutnaStranica].addRow({
					id: Number(dataStranica[trenutnaStranica].rows.length),
					name: 'row',
					y1: (cmY - Y - 15) / scale,
					y2: (cmY - Y + 15) / scale
				});
				dataStranica[trenutnaStranica] = dataStranica[trenutnaStranica];
			}),
			new ContextMenuEntry('Obriši red', 'ico', () => {
				dataStranica[trenutnaStranica].removeRow(row);
				dataStranica[trenutnaStranica] = dataStranica[trenutnaStranica];
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function showContextMenuCols(event: PointerEvent, column: TableColumnInterface) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Dodaj stupac', 'ico', () => {
				dataStranica[trenutnaStranica].addColumn({
					id: Number(data?.rows.length),
					name: 'column',
					x1: (cmX - X - 25) / scale,
					x2: (cmX - X + 25) / scale
				});
				dataStranica[trenutnaStranica] = dataStranica[trenutnaStranica];
			}),
			new ContextMenuEntry('Obriši stupac', 'ico', () => {
				dataStranica[trenutnaStranica].removeColumn(column);
				dataStranica[trenutnaStranica] = dataStranica[trenutnaStranica];
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
				dataStranica[trenutnaStranica].addRow({
					id: Number(dataStranica[trenutnaStranica].rows.length),
					name: 'row',
					y1: (cmY - Y - 15) / scale,
					y2: (cmY - Y + 15) / scale
				});
				dataStranica[trenutnaStranica] = dataStranica[trenutnaStranica];
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
				dataStranica[trenutnaStranica].addColumn({
					id: Number(dataStranica[trenutnaStranica].rows.length),
					name: 'column',
					x1: (cmX - X - 25) / scale,
					x2: (cmX - X + 25) / scale
				});
				dataStranica[trenutnaStranica] = dataStranica[trenutnaStranica];
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
		window.addEventListener('resize', () => {
			hideContextMenu();
		});
		document.addEventListener('click', () => {
			if (cmShow == true) {
				hideContextMenu();
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
			if (X < scaleW - data?.resolution[0] * scale) {
				X = scaleW - data?.resolution[0] * scale;
			}
			if (Y < scaleH - data?.resolution[1] * scale) {
				Y = scaleH - data?.resolution[1] * scale;
			}
			if (X > X0) X = X0;
			if (Y > Y0) Y = Y0;
		});
	});

	$: {
		if (data) scale = scaleW / data.resolution[0];
	}
</script>

<div class="w-full h-full" bind:clientWidth={scaleW} bind:clientHeight={scaleH}>
	<svg
		width="{data ? data.resolution[0] * scale : 0}px"
		height="{data ? data.resolution[1] * scale : 0}px"
		id="table"
		viewBox="0 0 {data ? data.resolution[0] + X0 / scale : 0} {data
			? data.resolution[1] + Y0 / scale
			: 0}"
	>
		{#if data}
			<image
				href={dataStranica[trenutnaStranica].image}
				transform="translate({X / scale} {Y / scale})"
			/>

			<g transform="translate({X / scale} {Y / scale})">
				{#each dataStranica[trenutnaStranica].rows as row}
					<RowHeaderDividerLine
						bind:row
						bind:scale
						width={dataStranica[trenutnaStranica].resolution[0]}
					/>
				{/each}
			</g>

			<g transform="translate({X / scale} {Y / scale})">
				{#each dataStranica[trenutnaStranica].columns as column}
					<ColumnHeaderDividerLine
						bind:column
						bind:scale
						height={dataStranica[trenutnaStranica].resolution[1]}
					/>
				{/each}
			</g>

			<g transform="translate(0 {Y / scale})">
				<RowHeaderBackground
					onRightClick={showContextMenuRowsBg}
					bind:scale
					height={dataStranica[trenutnaStranica].resolution[1]}
				/>
				{#each dataStranica[trenutnaStranica].rows as row}
					<RowHeader bind:row bind:scale onRightClick={showContextMenuRows} />
				{/each}
			</g>

			<g transform="translate(0 {Y / scale})">
				{#each dataStranica[trenutnaStranica].rows as row}
					<RowHeaderDivider bind:row bind:scale width={X0} />
				{/each}
			</g>

			<g transform="translate({X / scale} 0)">
				<ColumnHeaderBackground
					onRightClick={showContextMenuColsBg}
					width={dataStranica[trenutnaStranica].resolution[0]}
					bind:scale
				/>
				{#each dataStranica[trenutnaStranica].columns as column}
					<ColumnHeader bind:column bind:scale onRightClick={showContextMenuCols} />
				{/each}
			</g>

			<g transform="translate({X / scale} 0)">
				{#each dataStranica[trenutnaStranica].columns as column}
					<ColumnHeaderDivider bind:column bind:scale height={Y0} />
				{/each}
			</g>

			<Corner height={Y0 / scale} width={X0 / scale} x={0} y={0} />
		{/if}
	</svg>
</div>

<ContextMenu definition={contextMenuDefinition} visible={cmShow} x={cmX} y={cmY} />
