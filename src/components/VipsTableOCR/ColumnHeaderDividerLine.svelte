<script lang="ts">
	import type { TableColumn } from './index';

	export let column: TableColumn;
	export let scale: number;
	export let height: number;
</script>

<rect
	class="fill-red-300"
	height={height * scale}
	transform="translate({column.x1 * scale} 0)"
	width={2} />
<rect
	class="fill-red-300"
	height={height * scale}
	transform="translate({column.x2 * scale} 0)"
	width={2} />
