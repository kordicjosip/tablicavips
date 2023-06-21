<script lang="ts">
	import {
		COLUMN_HEADER_HEIGHT,
		ROW_HEADER_WIDTH,
		TableData,
		type TableRowInterface,
		type TableColumnInterface
	} from './index';
	import '../../app.css';
	import RowHeader from './/RowHeader.svelte';
	import ColumnHeader from './/ColumnHeader.svelte';
	import Corner from './Corner.svelte';
	import ColumnHeaderDivider from './/ColumnHeaderDivider.svelte';
	import RowHeaderDivider from './/RowHeaderDivider.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
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
	const dispatch = new createEventDispatcher();
	export let show_column_header = true;
	export let show_row_header = true;

	const X0 = show_row_header ? ROW_HEADER_WIDTH : 0;
	const Y0 = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
	let X = show_row_header ? ROW_HEADER_WIDTH : 0;
	let Y = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
	export let data: TableData;
	export let scale;

	let scaleW = 0;
	let scaleH = 0;

	let contextMenuDefinition = new ContextMenuDefinition();
	let elContextMenu = new ContextMenuGroup('Context menu');
	let cmX = 0;
	let cmY = 0;
	let cmShow = false;

	function showContextMenuRows(event: PointerEvent, row: TableRowInterface) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Dodaj red', 'ico', () => {
				dispatch('addRow', {
					id: Number(data.rows.length),
					name: 'row',
					y1: (event.offsetY - Y - 15) / scale,
					y2: (event.offsetY - Y + 15) / scale
				});
			}),
			new ContextMenuEntry('Obriši red', 'ico', () => {
				dispatch('removeRow', row);
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
				dispatch('addColumn', {
					id: Number(data?.rows.length),
					name: 'column',
					x1: (event.offsetX - X - 25) / scale,
					x2: (event.offsetX - X + 25) / scale
				});
			}),
			new ContextMenuEntry('Obriši stupac', 'ico', () => {
				dispatch('removeColumn', column);
			}),
			new ContextMenuEntry('Preimenuj', 'ico', () => {
				setTimeout(() => {
					showContextMenuColsRename(event, column);
				}, 1);
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
				dispatch('addRow', {
					id: Number(data.rows.length),
					name: 'row',
					y1: (event.offsetY - Y - 15) / scale,
					y2: (event.offsetY - Y + 15) / scale
				});
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
				dispatch('addColumn', {
					id: Number(data.rows.length),
					name: 'column',
					x1: (event.offsetX - X - 25) / scale,
					x2: (event.offsetX - X + 25) / scale
				});
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function showContextMenuColsRename(event: PointerEvent, column: TableColumnInterface) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Naziv', 'ico', () => {
				dispatch('renameColumn', {
					id: column.id,
					newName: 'Naziv'
				});
			}),
			new ContextMenuEntry('Barcode', 'ico', () => {
				dispatch('renameColumn', {
					id: column.id,
					newName: 'Barcode'
				});
			}),
			new ContextMenuEntry('Šifra', 'ico', () => {
				dispatch('renameColumn', {
					id: column.id,
					newName: 'Šifra'
				});
			}),
			new ContextMenuEntry('Količina', 'ico', () => {
				dispatch('renameColumn', {
					id: column.id,
					newName: 'Količina'
				});
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function hideContextMenu() {
		if (cmShow) cmShow = false;
	}

	function mousewheel(event: WheelEvent) {
		hideContextMenu();
		event.preventDefault();

		if (event.ctrlKey) {
			if (event.deltaY > 0) {
				scale = Math.max(scale - 0.05, 0.05);
			} else {
				scale = Math.min(scale + 0.05, 2.5);
			}
			return;
		}

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
	}

	function toggleSelectAllColumnHeaders() {
		data.columns.forEach((column) => {
			column.selected = !column.selected;
		});
		data = data;
	}

	function setOffset(event) {
		if (data.isUnlinked) {
			data.setOffset(event.detail);
			data = data;
		} else {
			dispatch('setOffsetColumnsAllTables', event.detail);
			data = data;
		}
	}

	function setOffsetColumnAllTables(event) {
		dispatch('setOffsetColumnAllTables', {
			id: event.detail.id,
			offset: event.detail.offset
		});
		data = data;
	}

	onMount(async () => {
		scale = (scaleW - X0) / data.resolution[0];
	});
</script>

<svelte:window on:click={hideContextMenu} on:resize={hideContextMenu} />

<div class="w-full h-full" bind:clientWidth={scaleW} bind:clientHeight={scaleH}>
	<svg width="100%" height="100%" on:mousewheel={mousewheel}>
		<image href={data.image} transform="translate({X} {Y}) scale({scale})" />
		<g transform="translate({X} {Y})">
			{#each data.rows as row}
				<RowHeaderDividerLine bind:row bind:scale width={data.resolution[0]} />
			{/each}
			{#each data.columns as column}
				<ColumnHeaderDividerLine bind:column bind:scale height={data.resolution[1]} />
			{/each}
		</g>

		<g transform="translate({X} {Y}) scale({scale})">
			{#each data.ocr as ocr}
				<g transform="translate({ocr.x1 - data.tableCrop.x1} {ocr.y1 - data.tableCrop.y1})">
					<rect x='0' y='0' width={(ocr.x2 - ocr.x1)} height={(ocr.y2 - ocr.y1)} fill="rgba(240,240,240,80%)">
					</rect>
					<text
						class="fill-black"
						dominant-baseline="central"
						font-size="10pt"
						text-anchor="middle"
						x={(ocr.x2 - ocr.x1) / 2}
						y={(ocr.y2 - ocr.y1) / 2}>{ocr.text}</text
					>
				</g>
			{/each}
		</g>

		<g transform="translate(0 {Y})">
			<RowHeaderBackground
				onRightClick={showContextMenuRowsBg}
				bind:scale
				height={data.resolution[1]}
			/>
			{#each data.rows as row}
				<RowHeader
					bind:row
					bind:scale
					height={data.resolution[1]}
					onRightClick={showContextMenuRows}
				/>
			{/each}

			{#each data.rows as row}
				<RowHeaderDivider bind:row bind:scale width={X0} />
			{/each}
		</g>

		<g transform="translate({X} 0)">
			<ColumnHeaderBackground
				onRightClick={showContextMenuColsBg}
				width={data.resolution[0]}
				bind:scale
			/>
			{#each data.columns as column}
				<ColumnHeader
					bind:column
					bind:scale
					bind:data
					onRightClick={showContextMenuCols}
					on:dblclick={toggleSelectAllColumnHeaders}
					on:setOffset={setOffset}
					on:setOffsetColumnAllTables={setOffsetColumnAllTables}
				/>
			{/each}

			{#each data.columns as column}
				<ColumnHeaderDivider bind:column bind:scale height={Y0} />
			{/each}
		</g>

		<Corner height={Y0} width={X0} />
	</svg>
</div>

<ContextMenu definition={contextMenuDefinition} visible={cmShow} x={cmX} y={cmY} />
