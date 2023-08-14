<script lang="ts">
	import { ROW_HEADER_WIDTH } from './index';

	export let height: number;
	export let scale: number;
	export let onRightClick: Function;
</script>

<g
	id="row-header"
	on:contextmenu={(event) => {
		event.preventDefault();
		onRightClick(event);
	}}>
	<rect height={height * scale} width={ROW_HEADER_WIDTH} fill="lightgray" />
</g>
