<script lang="ts">
	import { onMount } from 'svelte';
	import { ROW_HEADER_WIDTH } from './index';

	export let height: number = 0;
	export let scale: number = 0;
	export let onRightClick: Function = null;

	onMount(async () => {
		document.getElementById(`row-header`).addEventListener('contextmenu', (event: PointerEvent) => {
			event.preventDefault();
			onRightClick(event);
		});
	});
</script>

<g id="row-header">
	<rect {height} width={ROW_HEADER_WIDTH / scale} fill="lightgray" />
</g>
