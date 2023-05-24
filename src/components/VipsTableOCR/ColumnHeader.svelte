<script lang="ts">
	import { COLUMN_HEADER_HEIGHT, TableColumn, type TableColumnInterface } from './index';
	import { onMount } from 'svelte';
	import { drag, select } from 'd3';

	export let column: TableColumn;
	export let scale: number = 1;
	export let onRightClick: (event: PointerEvent, column: TableColumnInterface) => void = null;

	onMount(async () => {
		select(`#column-header-${column.id}`).call(
			drag().on('drag', function (event: any) {
				select(`#column-header-${column.id}`);
				column.x1 += event.dx;
				column.x2 += event.dx;
				if (column.x1 < 0) {
					let sirina = column.width;
					column.x1 = 0;
					column.x2 = sirina;
				}
			})
		);

		document
			.getElementById(`column-header-${column.id}`)
			.addEventListener('contextmenu', (event: PointerEvent) => {
				event.preventDefault();
				onRightClick(event, column);
			});
	});
</script>

<g id="column-header-{column.id}" transform="translate({column.x1} 0)">
	<svg
		class="cursor-grab fill-teal-400 hover:fill-teal-500"
		height={COLUMN_HEADER_HEIGHT / scale}
		width={column.width}
	>
		<rect height={COLUMN_HEADER_HEIGHT / scale} stroke="black" width={column.width} />
		<text
			class="fill-black"
			dominant-baseline="central"
			font-size="{10 / scale}pt"
			text-anchor="middle"
			x={column.width / 2}
			y={COLUMN_HEADER_HEIGHT / scale / 2}>{column.name}</text
		>
	</svg>
</g>
