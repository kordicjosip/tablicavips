<script lang="ts">
  import { DataTableData, DataTableRow, ROW_HEADER_WIDTH } from "../../components/DataTable";
  import { onMount } from "svelte";
  import { drag, select } from "d3";

  export let row: DataTableRow;
  export let dataTable: DataTableData;

  /**
   * Ako je true odmah nakon pomicanja računa se raspored kolona tablice
   */
  export let high_performance = false;

  let offset: number;
  $: offset = row.y2-row.y1;

  onMount(async () => {
    select(`#drag-row-${row.id}`).call(
      drag()
        .on("drag", function (event: any) {
          // TODO create global class cursor-row-resize-important
          select(`#table`).classed("cursor-row-resize", true);
          select(`#drag-row-${row.id}`)
            .attr("width", "100vw")
            .attr("class", "cursor-row-resize fill-gray-400");
          // TODO change line position when not high performance

            row.y2 = event.y - row.y1;

            dataTable.recalculateRows();

            if (offset < 1) {
              offset = 1;
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
  transform="translate(0 {row.y1})"
  id="drag-row-{row.y1}"
  y={offset - 1.5}
  fill="rgba(0,0,0,0)"
  width={ROW_HEADER_WIDTH}
  height="5"
  class="cursor-row-resize fill-transparent hover:fill-amber-400"></rect>
