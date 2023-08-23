<script lang="ts">
	import type { TableRow } from './index';

	export let row: TableRow;
	export let scale: number;
	export let width: number;
</script>

<rect
	class="fill-blue-300"
	height={2}
	transform="translate(0 {row.y1 * scale})"
	width={width * scale} />
<rect
	class="fill-blue-300"
	height={2}
	transform="translate(0 {row.y2 * scale})"
	width={width * scale} />
