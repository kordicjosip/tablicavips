<script lang="ts">
	import { COLUMN_HEADER_HEIGHT } from './index';

	export let width: number;
	export let scale: number;
	export let onRightClick: Function;
</script>

<g
	id="column-header"
	on:contextmenu={(event) => {
		event.preventDefault();
		onRightClick(event);
	}}>
	<rect fill="lightgray" height={COLUMN_HEADER_HEIGHT} width={width * scale} />
</g>
