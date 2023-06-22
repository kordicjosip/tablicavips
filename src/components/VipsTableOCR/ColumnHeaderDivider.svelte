<script lang="ts">
	import { TableColumn } from './index';
	import { onMount } from 'svelte';
	import { drag, select } from 'd3';

	export let column: TableColumn;
	export let height: number;
	export let scale: number;

	onMount(async () => {
		select(`#drag-col-${column.id}-1`).call(
			drag().on('drag', function (event: any) {
				column._x1 += event.dx / scale;
				console.log(column._x1, column.x1, column._x2, column.x2);
				if (column.width < 1) {
					column.x2 = column.x1 - column.offset + 1;
				}
				if (column.x1 < 0) {
					column.x1 = -column.offset;
				}
			})
		);
		select(`#drag-col-${column.id}-2`).call(
			drag().on('drag', function (event: any) {
				column._x2 += event.dx / scale;
				if (column.width < 1) {
					column.x1 = column.x2 - column.offset - 1;
				}
				if (column.x1 < 0) {
					column.x1 = -column.offset;
					column.x2 = -column.offset + 40;
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
