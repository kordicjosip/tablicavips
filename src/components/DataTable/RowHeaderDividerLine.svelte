<script lang="ts">
    import { DataTableRow } from "./index";

    export let row: DataTableRow;
    export let width: number;
</script>
<rect
        class="fill-blue-400"
        height="3"
        transform="translate(0 {row.y1})"
        width={width}></rect>
<rect
        class="fill-blue-400"
        height="3"
        transform="translate(0 {row.y2})"
        width={width}></rect>
