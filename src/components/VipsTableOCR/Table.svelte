<script lang="ts">
	import {
		COLUMN_HEADER_HEIGHT,
		ROW_HEADER_WIDTH,
		TableData,
		type TableRowInterface,
		type TableColumnInterface
	} from './index';
	import { env } from '$env/dynamic/public';
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
	import OCRElement from './OCRElement.svelte';
	import { columnTypes } from '$components/VipsTableOCR/columnTypes';
	import ColumnSettingsDialog from '$components/VipsTableOCR/ColumnSettingsDialog.svelte';

	const dispatch = createEventDispatcher();
	export let show_column_header = true;
	export let show_row_header = true;

	const X0 = show_row_header ? ROW_HEADER_WIDTH : 0;
	const Y0 = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
	let X = show_row_header ? ROW_HEADER_WIDTH : 0;
	let Y = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
	export let data: TableData | undefined;
	export let scale: number;

	let scaleW = 0;
	let scaleH = 0;

	let contextMenuDefinition = new ContextMenuDefinition();
	let elContextMenu = new ContextMenuGroup('Context menu');
	let cmX = 0;
	let cmY = 0;
	let cmShow = false;

	let dialog: ColumnSettingsDialog;

	function showContextMenuRows(event: PointerEvent, row: TableRowInterface) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Obriši red', () => {
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
			new ContextMenuEntry('Obriši stupac', () => {
				dispatch('removeColumn', column);
			}),
			new ContextMenuEntry('Preimenuj', () => {
				setTimeout(() => {
					showContextMenuColsRename(event, column);
				}, 1);
				data = data;
			})
		);
		if (column.type) {
			elContextMenu.entries.push(
				new ContextMenuEntry('Postavke', () => {
					setTimeout(() => {
						showContextMenuColsPostavke(event, column);
					}, 1);
					data = data;
				})
			);
		}
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function showContextMenuRowsBg(event: PointerEvent) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('Dodaj red', () => {
				dispatch('addRow', {
					id: Number(data!.rows.length),
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
			new ContextMenuEntry('Dodaj stupac', () => {
				dispatch('addColumn', {
					id: Number(data!.rows.length),
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
			...columnTypes.map((columnType) => {
				return new ContextMenuEntry(columnType.name, () => {
					dispatch('setColumnType', {
						id: column.id,
						column: columnType
					});
				});
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function showContextMenuColsPostavke(event: PointerEvent, column: TableColumnInterface) {
		cmX = event.x;
		cmY = event.y;
		elContextMenu.entries = [];
		elContextMenu.entries.push(
			new ContextMenuEntry('RegExp', () => {
				dialog.show(column.id);
			})
		);
		contextMenuDefinition.groups = [];
		contextMenuDefinition.groups.push(elContextMenu);
		cmShow = true;
	}

	function setColumnRegexString(event: CustomEvent) {
		dispatch('setColumnRegexString', {
			id: event.detail.id,
			regexString: event.detail.regexString
		});
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
		if (X < scaleW - data!.resolution[0] * scale) {
			X = scaleW - data!.resolution[0] * scale;
		}
		if (Y < scaleH - data!.resolution[1] * scale) {
			Y = scaleH - data!.resolution[1] * scale;
		}
		if (X > X0) X = X0;
		if (Y > Y0) Y = Y0;
	}

	function toggleSelectAllColumnHeaders() {
		data!.columns.forEach((column) => {
			column.selected = !column.selected;
		});
		data = data;
	}

	function setOffset(event: CustomEvent) {
		if (data!.isUnlinked) {
			data!.setOffset(event.detail);
			data = data;
		} else {
			dispatch('setOffsetColumnsAllTables', event.detail);
			data = data;
		}
	}

	function setOffsetColumnAllTables(event: CustomEvent) {
		dispatch('setOffsetColumnAllTables', {
			id: event.detail.id,
			offset: event.detail.offset
		});
		data = data;
	}

	function dragX1AllTables(event: CustomEvent) {
		dispatch('dragX1AllTables', {
			id: event.detail.id,
			offset: event.detail.offset
		});
		data = data;
	}

	function dragX2AllTables(event: CustomEvent) {
		dispatch('dragX2AllTables', {
			id: event.detail.id,
			offset: event.detail.offset
		});
		data = data;
	}

	onMount(async () => {
		scale = (scaleW - X0) / data!.resolution[0];
		console.log(data);
	});
</script>

<svelte:window on:click={hideContextMenu} on:resize={hideContextMenu} />

<div class="w-full h-full" bind:clientWidth={scaleW} bind:clientHeight={scaleH}>
	{#if data}
		<svg width="100%" height="100%" on:wheel={mousewheel}>
			<image
				href="{env.PUBLIC_API_URL}/slika-tablice/{data.id}"
				transform="translate({X} {Y}) scale({scale})" />
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
					{#if ocr.y1 < data.tableCrop.y2}
						<OCRElement
							bind:ocr
							offsetX={data.tableCrop.x1}
							offsetY={data.tableCrop.y1}
							selected={data.isOCRSelected(ocr)} />
					{/if}
				{/each}
			</g>

			<g transform="translate(0 {Y})">
				<RowHeaderBackground
					onRightClick={showContextMenuRowsBg}
					bind:scale
					height={data.resolution[1]} />
				{#each data.rows as row}
					<RowHeader
						bind:row
						bind:scale
						tableHeight={data.resolution[1]}
						onRightClick={showContextMenuRows} />
				{/each}

				{#each data.rows as row}
					<RowHeaderDivider bind:row bind:scale width={X0} tableHeight={data.resolution[1]} />
				{/each}
			</g>

			<g transform="translate({X} 0)">
				<ColumnHeaderBackground
					onRightClick={showContextMenuColsBg}
					width={data.resolution[0]}
					bind:scale />
				{#each data.columns as column}
					<ColumnHeader
						bind:column
						bind:scale
						isUnlinked={data.isUnlinked}
						onRightClick={showContextMenuCols}
						on:dblclick={toggleSelectAllColumnHeaders}
						on:setOffset={setOffset}
						on:setOffsetColumnAllTables={setOffsetColumnAllTables} />
				{/each}

				{#each data.columns as column}
					<ColumnHeaderDivider
						bind:column
						bind:scale
						isUnlinked={data.isUnlinked}
						height={Y0}
						on:dragX1AllTables={dragX1AllTables}
						on:dragX2AllTables={dragX2AllTables} />
				{/each}
			</g>

			<Corner height={Y0} width={X0} />
		</svg>
	{/if}
</div>

<ContextMenu definition={contextMenuDefinition} visible={cmShow} x={cmX} y={cmY} />
<ColumnSettingsDialog bind:this={dialog} on:setColumnRegexString={setColumnRegexString} />
