<script lang="ts">
	import { TableColumn, TableData } from './index';
	import { createEventDispatcher, onMount } from 'svelte';
	import { drag, select } from 'd3';

	export let column: TableColumn;
	export let height: number;
	export let scale: number;
	export let data: TableData;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		select(`#drag-col-${column.id}-1`).call(
			drag().on('drag', function (event: any) {
				if (data.isUnlinked) {
					column._x1 += event.dx / scale;
					if (column.width < 1) {
						column.x2 = column.x1 - column.offset + 1;
					}
					if (column.x1 < 0) {
						column.x1 = -column.offset;
					}
				} else {
					dispatch('dragX1AllTables', {
						id: column.id,
						offset: event.dx / scale
					});
				}
			})
		);
		select(`#drag-col-${column.id}-2`).call(
			drag().on('drag', function (event: any) {
				if (data.isUnlinked) {
					column._x2 += event.dx / scale;
					if (column.width < 1) {
						column.x1 = column.x2 - column.offset - 1;
					}
					if (column.x1 < 0) {
						column.x1 = -column.offset;
						column.x2 = -column.offset + 40;
					}
				} else {
					dispatch('dragX2AllTables', {
						id: column.id,
						offset: event.dx / scale
					});
				}
			})
		);
	});
</script>

<rect
	class="cursor-col-resize fill-red-500 hover:w-1.5"
	{height}
	id="drag-col-{column.id}-1"
	transform="translate({column.x1 * scale} 0)"
	width={3}
/>
<rect
	class="cursor-col-resize fill-red-500 hover:w-1.5"
	{height}
	id="drag-col-{column.id}-2"
	transform="translate({column.x2 * scale} 0)"
	width={3}
/>
