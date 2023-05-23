<script lang="ts">
	import { DataTableColumn } from './index';

	export let column: DataTableColumn;
	export let scale: number = 1;
	export let height: number;
</script>

<rect class="fill-red-400" {height} transform="translate({column.x1} 0)" width="{3/scale}" />
<rect class="fill-red-400" {height} transform="translate({column.x2} 0)" width="{3/scale}" />
