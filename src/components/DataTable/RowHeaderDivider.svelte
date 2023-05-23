<script lang="ts">
	import { DataTableRow } from './index';
	import { onMount } from 'svelte';
	import { drag, select } from 'd3';

	export let row: DataTableRow;
	export let width: number;
	export let scale: number = 1;

	onMount(async () => {
		select(`#drag-row-${row.id}-1`).call(
			drag().on('drag', function (event: any) {
				row.y1 += event.dy;

				if (row.height < 1) {
					row.y2 = row.y1 + 1;
				}
				if (row.y1 < 0) {
					row.y1 = 0;
				}
			})
		);
		select(`#drag-row-${row.id}-2`).call(
			drag().on('drag', function (event: any) {
				row.y2 += event.dy;

				if (row.height < 1) {
					row.y1 = row.y2 - 1;
				}
				if (row.y1 < 0) {
					row.y1 = 0;
					row.y2 = 30;
				}
			})
		);
	});
</script>

<rect
	class="cursor-row-resize fill-blue-500 hover:h-1.5"
	height="{3 / scale}"
	id="drag-row-{row.id}-1"
	transform="translate(0 {row.y1})"
	width={width / scale}
/>
<rect
	class="cursor-row-resize fill-blue-500 hover:h-1.5"
	height="{3 / scale}"
	id="drag-row-{row.id}-2"
	transform="translate(0 {row.y2})"
	width={width / scale}
/>
