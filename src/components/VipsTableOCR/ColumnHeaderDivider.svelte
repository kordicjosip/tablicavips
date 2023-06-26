<script lang="ts">
	import { TableColumn } from './index';
	import { createEventDispatcher, onMount } from 'svelte';
	import { drag, select } from 'd3';

	export let column: TableColumn;
	export let height: number;
	export let scale: number;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		select(`#drag-col-${column.id}-1`).call(
			drag().on('drag', function (event: any) {
				dispatch('dragX1AllTables', {
					id: column.id,
					offset: event.dx / scale
				});
			})
		);
		select(`#drag-col-${column.id}-2`).call(
			drag().on('drag', function (event: any) {
				dispatch('dragX2AllTables', {
					id: column.id,
					offset: event.dx / scale
				});
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
