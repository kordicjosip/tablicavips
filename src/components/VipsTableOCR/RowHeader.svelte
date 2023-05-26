<script lang="ts">
	import { TableRow, type TableRowInterface, ROW_HEADER_WIDTH } from './index';
	import { onMount } from 'svelte';
	import { drag, select } from 'd3';

	export let row: TableRow;
	export let scale: number;
	export let onRightClick: (event: PointerEvent, row: TableRowInterface) => void;

	onMount(async () => {
		select(`#row-header-${row.id}`).call(
			drag().on('drag', function (event: any) {
				row.y1 += event.dy / scale;
				row.y2 += event.dy / scale;
				if (row.y1 < 0) {
					let visina = row.height;
					row.y1 = 0;
					row.y2 = visina;
				}
			})
		);
	});
</script>

<g
	id="row-header-{row.id}"
	transform="translate(0 {row.y1 * scale})"
	on:contextmenu={(event) => {
		event.preventDefault();
		onRightClick(event, row);
	}}
>
	<svg
		class="cursor-grab fill-teal-400 hover:fill-teal-500"
		height={row.height * scale}
		width={ROW_HEADER_WIDTH}
	>
		<rect height={row.height * scale} stroke="black" width={ROW_HEADER_WIDTH} />
		<text
			class="fill-black"
			dominant-baseline="central"
			font-size="10pt"
			text-anchor="start"
			x={2}
			y={(row.height * scale) / 2}>{row.name === null ? row.id : row.name}</text
		>
	</svg>
</g>
