<script lang="ts">
	import {
		COLUMN_HEADER_HEIGHT,
		TableColumn,
		type TableColumnInterface,
		TablesData
	} from './index';
	import { createEventDispatcher, onMount } from 'svelte';
	import { drag, select } from 'd3';

	const dispatch = createEventDispatcher();

	export let column: TableColumn;
	export let scale: number;
	export let data: TablesData;
	export let onRightClick: (event: PointerEvent, column: TableColumnInterface) => void;

	onMount(async () => {
		select(`#column-header-${column.id}`).call(
			drag().on('drag', function (event: any) {
				if (data.otkljucana) {
					if (column.selected) {
						dispatch('setOffset', event.dx / scale);
					} else {
						column.setOffset(event.dx / scale);
						column = column;
					}
				} else {
					if (column.selected) {
						dispatch('setOffset', event.dx / scale);
					} else {
						/*TODO funkcija za pomjeranje stupca na svim stranicama*/
						console.log('jedan stupac na svim stranicama');
					}
				}
			})
		);
	});
	function dblclick() {
		dispatch('dblclick');
	}
</script>

<g
	id="column-header-{column.id}"
	on:contextmenu={(event) => {
		event.preventDefault();
		onRightClick(event, column);
	}}
	on:dblclick={dblclick}
	transform="translate({column.x1 * scale} 0)"
>
	<svg
		class="cursor-grab {column.selected
			? 'fill-blue-400 hover:fill-blue-500'
			: 'fill-teal-400 hover:fill-teal-500'}"
		height={COLUMN_HEADER_HEIGHT}
		width={column.width * scale}
	>
		<rect height={COLUMN_HEADER_HEIGHT} stroke="black" width={column.width * scale} />
		<text
			class="fill-black"
			dominant-baseline="central"
			font-size="10pt"
			text-anchor="middle"
			x={(column.width * scale) / 2}
			y={COLUMN_HEADER_HEIGHT / 2}>{column.name}</text
		>
	</svg>
</g>
