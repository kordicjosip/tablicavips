<script lang="ts">
  import "../../app.css";
  import { DataTableData, DataTableRow, ROW_HEADER_WIDTH } from "../../components/DataTable";
  import { onMount } from "svelte";
  import { drag, select } from "d3";

  export let row: DataTableRow;
  export let dataTable: DataTableData;
  export let high_performance = false;

  let offset: number;
  $: offset = row.height;

  onMount(async () => {
    select(`#drag-row-${row.id}`).call(
      drag()
        .on("drag", function (event: any) {
          select(`#table`).classed("cursor-row-resize", true);
          select(`#drag-row-${row.id}`)
            .attr("width", "100vw")
            .attr("class", "cursor-row-resize fill-gray-400");
          if (high_performance) {
            row.height = event.y - row.y;

            if (row.height < 1) {
              row.height = 1;
            }

            dataTable.recalculateRows();
          } else {
            offset = event.y - row.y;

            if (offset < 1) {
              offset = 1;
            }
          }
        })
        .on("end", function (event: any) {
          select(`#table`).classed("cursor-row-resize", false);
          select(`#drag-row-${row.id}`)
            .attr("width", ROW_HEADER_WIDTH)
            .attr("class", "cursor-row-resize fill-transparent hover:fill-amber-400");
          // Recalculate column positions on end
          row.height = event.y - row.y;
          if (row.height < 1) {
            row.height = 1;
          }
          dataTable.recalculateRows();

          // Notify changes
          dataTable = dataTable;
        })
    );
  });
</script>

<rect
  transform="translate(0 {row.y})"
  id="drag-row-{row.id}"
  y={offset - 1.5}
  fill="rgba(0,0,0,0)"
  width={ROW_HEADER_WIDTH}
  height="5"
  class="cursor-row-resize fill-transparent hover:fill-amber-400 z-40"></rect>
<rect
        transform="translate(0 {row.y})"
        id="{row.id}"
        y={offset - 1.5}
        width="100vw"
        height="2"
        class="fill-blue-600 z-30"></rect>
