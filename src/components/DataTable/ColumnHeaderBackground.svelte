<script lang='ts'>
	import { onMount } from 'svelte';
	import { COLUMN_HEADER_HEIGHT } from './index';

	export let width: number = 0;
	export let scale: number = 0;
	export let onRightClick: Function = null;

	onMount(async () => {
		document
			.getElementById(`column-header`)
			.addEventListener('contextmenu', (event: PointerEvent) => {
				event.preventDefault();
				onRightClick(event);
			});
	});
</script>

<g id='column-header'>
	<rect fill='lightgray' height={COLUMN_HEADER_HEIGHT / scale} {width} />
</g>
