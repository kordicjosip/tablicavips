<script lang="ts">
    import "../../app.css";
    import {DataTableData, DataTableRow, ROW_HEADER_WIDTH} from "../../components/DataTable";
    import {onMount} from "svelte";
    import {drag, select} from "d3";

    export let row: DataTableRow;
    export let dataTable: DataTableData;
    export let high_performance = false;

    let offset: number;
    $: offset = row.height;

    onMount(async () => {
        select(`#drag-row-${row.id}-1`).call(
            drag()
                .on("drag", function (event: any) {
                    select(`#table`).classed("cursor-row-resize", true);
                    select(`#drag-row-${row.id}`);
                    row.y1 += event.dy;

                    if (row.height < 1) {
                        row.height = 1;
                    }

                })
        );
        select(`#drag-row-${row.id}-2`).call(
            drag()
                .on("drag", function (event: any) {
                    select(`#table`).classed("cursor-row-resize", true);
                    select(`#drag-row-${row.id}`);
                    row.y2 += event.dy;

                    if (row.height < 1) {
                        row.height = 1;
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
        width="100vw"></rect>
<rect
        class="cursor-row-resize fill-blue-600 hover:h-1.5"
        height="3"
        id="drag-row-{row.id}-2"
        transform="translate(0 {row.y2})"
        width="100vw"></rect>
