<script lang="ts">
    import "../../app.css";
    import { DataTableColumn } from "../../components/DataTable";
    import {onMount} from "svelte";
    import {drag, select} from "d3";

    export let column: DataTableColumn;

    onMount(async () => {
        select(`#drag-col-${column.id}-1`).call(
            drag()
                .on("drag", function (event: any) {
                    select(`#drag-col-${column.id}`)
                    column.x1 += event.dx;

                    if (column.width < 1) {
                        column.x2 = column.x1 + 1;
                    }
                })
        );
        select(`#drag-col-${column.id}-2`).call(
            drag()
                .on("drag", function (event: any) {
                    select(`#drag-col-${column.id}`)
                    column.x2 += event.dx;

                    if (column.width < 1) {
                        column.x1 = column.x2 - 1;
                    }
                })
        );
    });
</script>
<rect
        class="cursor-col-resize fill-red-500 hover:w-1.5"
        height="100%"
        id="drag-col-{column.id}-1"
        transform="translate({column.x1} 0)"
        width="3"></rect>
<rect
        class="cursor-col-resize fill-red-500 hover:w-1.5"
        height="100%"
        id="drag-col-{column.id}-2"
        transform="translate({column.x2} 0)"
        width="3"></rect>
