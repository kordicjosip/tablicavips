<script lang="ts">
	import type { TableRow } from './index';
	import { onMount } from 'svelte';
	import { drag, select } from 'd3';

	export let row: TableRow;
	export let width: number;
	export let scale: number;
	export let tableHeight: number;

	onMount(async () => {
		select(`#drag-row-${row.id}-1`).call(
			drag().on('drag', function (event: any) {
				row.y1 += event.dy / scale;

				if (row.height < 1) {
					row.y2 = row.y1 + 1;
				}
				if (row.y1 < 0) {
					row.y1 = 0;
				}
				if (row.y2 > tableHeight) {
					let visina = row.height;
					row.y1 = tableHeight - visina - 30;
					row.y2 = tableHeight;
				}
			})
		);
		select(`#drag-row-${row.id}-2`).call(
			drag().on('drag', function (event: any) {
				row.y2 += event.dy / scale;

				if (row.height < 1) {
					row.y1 = row.y2 - 1;
				}
				if (row.y1 < 0) {
					row.y1 = 0;
					row.y2 = 30;
				}
				if (row.y2 > tableHeight) {
					row.y2 = tableHeight;
				}
			})
		);
	});
</script>

<rect
	class="cursor-row-resize fill-blue-400 hover:h-1.5"
	height={3}
	id="drag-row-{row.id}-1"
	transform="translate(0 {row.y1 * scale})"
	{width} />
<rect
	class="cursor-row-resize fill-blue-400 hover:h-1.5"
	height={3}
	id="drag-row-{row.id}-2"
	transform="translate(0 {row.y2 * scale})"
	{width} />
