<script lang="ts">
  import { DataTableColumn, DataTableData, COLUMN_HEADER_HEIGHT } from "../../components/DataTable";
  import { onMount } from "svelte";
  import { drag, select } from "d3";

  export let column: DataTableColumn;
  export let dataTable: DataTableData;

  /**
   * Ako je true odmah nakon pomicanja računa se raspored kolona tablice
   */
  export let high_performance = false;

  // Recalculate offset when column.width changes
  // Used to position draggable element when !high_performance
  let offset;
  $: offset = column.x2-column.x1;

  onMount(async () => {
    select(`#drag-col-${column.id}`).call(
      drag()
        .on("drag", function (event: any) {
          // TODO create global class cursor-col-resize-important
          select(`#table`).classed("cursor-col-resize", true);
          select(`#drag-col-${column.id}`)
            .attr("height", "100vh")
            .attr("class", "cursor-col-resize fill-gray-400");
          // TODO change line position when not high performance

            column.x2 = event.x - column.x1;

            dataTable.recalculateColumns();

            if (offset < 1) {
              offset = 1;
            }

        })
        .on("end", function (event: any) {
          select(`#table`).classed("cursor-col-resize", false);
          select(`#drag-col-${column.x1}`)
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
  transform="translate({column.x1} 0)"
  id="drag-col-{column.x1}"
  x={offset - 1.5}
  width="5"
  height={COLUMN_HEADER_HEIGHT}
  class="cursor-col-resize fill-transparent hover:fill-amber-400"></rect>
