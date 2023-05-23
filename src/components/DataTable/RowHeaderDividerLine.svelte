<script lang="ts">
	import { DataTableRow } from './index';

	export let row: DataTableRow;
	export let scale: number = 1;
	export let width: number;
</script>

<rect class="fill-blue-400" height="{3/scale}" transform="translate(0 {row.y1})" {width} />
<rect class="fill-blue-400" height="{3/scale}" transform="translate(0 {row.y2})" {width} />
