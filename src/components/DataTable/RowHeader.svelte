<script lang="ts">
  import "../../app.css";
  import { DataTableRow, ROW_HEADER_WIDTH } from "./index";
  import { onMount } from "svelte";
  import {drag, select} from "d3";

  export let row: DataTableRow;
  export let onRightClick: Function = null;

  onMount(async () => {
    select(`#row-header-${row.id}`).call(
            drag()
                    .on("drag", function (event: any) {
                      select(`#row-header-${row.id}`)
                      row.y1 += event.dy;
                      row.y2 += event.dy;
                    })
    );

    document
      .getElementById(`row-header-${row.id}`)
      .addEventListener("contextmenu", (event: PointerEvent) => {
        event.preventDefault();
        onRightClick(event);
      });
  });
  </script>

<g transform="translate(0 {row.y1})" id="row-header-{row.id}">
  <svg
    width={ROW_HEADER_WIDTH}
    height={row.height}
    class="cursor-grab fill-teal-400 hover:fill-teal-500"
  >
    <rect width={ROW_HEADER_WIDTH} height={row.height} stroke="black" />
    <text
      x={ROW_HEADER_WIDTH - 1}
      y={row.height / 2}
      text-anchor="end"
      class="fill-black"
      dominant-baseline="central"
      font-size="10pt">{row.name === null ? row.id : row.name}</text
    >
  </svg>
</g>
