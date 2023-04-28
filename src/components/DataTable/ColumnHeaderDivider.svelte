<script lang="ts">
  import "../../app.css";
  import { DataTableColumn, DataTableData, COLUMN_HEADER_HEIGHT } from "../../components/DataTable";
  import { onMount } from "svelte";
  import { drag, select } from "d3";

  export let column: DataTableColumn;
  export let dataTable: DataTableData;
  export let high_performance = false;

  let offset;
  $: offset = column.width;

  onMount(async () => {
    select(`#drag-col-${column.id}`).call(
      drag()
        .on("drag", function (event: any) {
          select(`#table`).classed("cursor-col-resize", true);
          select(`#drag-col-${column.id}`)
            .attr("height", "100vh")
            .attr("class", "cursor-col-resize fill-gray-400");
          if (high_performance) {
            column.width = event.x - column.x;

            if (column.width < 1) {
              column.width = 1;
            }

            dataTable.recalculateColumns();
          } else {
            offset = event.x - column.x;

            if (offset < 1) {
              offset = 1;
            }
          }
        })
        .on("end", function (event: any) {
          select(`#table`).classed("cursor-col-resize", false);
          select(`#drag-col-${column.id}`)
            .attr("height", COLUMN_HEADER_HEIGHT)
            .attr("class", "cursor-col-resize fill-transparent hover:fill-amber-400");
          // Recalculate column positions on end
          column.width = event.x - column.x;
          if (column.width < 1) {
            column.width = 1;
          }
          dataTable.recalculateColumns();

          // Notify changes
          dataTable = dataTable;
        })
    );
  });
</script>

<rect
  transform="translate({column.x} 0)"
  id="drag-col-{column.id}"
  x={offset - 1.5}
  width="5"
  height={COLUMN_HEADER_HEIGHT}
  class="cursor-col-resize fill-transparent hover:fill-amber-400"></rect>
<rect
        transform="translate({column.x} 0)"
        id="{column.id}"
        x={offset - 1.5}
        width="2"
        height="100vh"
        class="fill-red-600 pointer-events-none"></rect>
