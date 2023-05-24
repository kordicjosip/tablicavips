<script lang="ts">
	import { TableRow } from './index';

	export let row: TableRow;
	export let scale: number = 1;
	export let width: number;
</script>

<rect class="fill-blue-400" height={3 / scale} transform="translate(0 {row.y1})" {width} />
<rect class="fill-blue-400" height={3 / scale} transform="translate(0 {row.y2})" {width} />
