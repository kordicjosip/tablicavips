<script lang="ts">
    import "../../app.css";
    import { DataTableRow } from "../../components/DataTable";
    import {onMount} from "svelte";
    import {drag, select} from "d3";

    export let row: DataTableRow;

    onMount(async () => {
        select(`#drag-row-${row.id}-1`).call(
            drag()
                .on("drag", function (event: any) {
                    select(`#drag-row-${row.id}`);
                    row.y1 += event.dy;

                    if (row.height < 1) {
                        row.y2 = row.y1 + 1;
                    }

                })
        );
        select(`#drag-row-${row.id}-2`).call(
            drag()
                .on("drag", function (event: any) {
                    select(`#drag-row-${row.id}`);
                    row.y2 += event.dy;

                    if (row.height < 1) {
                        row.y1 = row.y2 - 1;
                    }

                })
        );
    });
</script>
<rect
        class="cursor-row-resize fill-blue-600 hover:h-1.5"
        height="3"
        id="drag-row-{row.id}-1"
        transform="translate(0 {row.y1})"
        width="100%"></rect>
<rect
        class="cursor-row-resize fill-blue-600 hover:h-1.5"
        height="3"
        id="drag-row-{row.id}-2"
        transform="translate(0 {row.y2})"
        width="100%"></rect>
