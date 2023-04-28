<script lang="ts">
  import "../../app.css";
  import {COLUMN_HEADER_HEIGHT, DataTableRow, ROW_HEADER_WIDTH} from "../../components/DataTable";
  import { onMount } from "svelte";

  export let row: DataTableRow;
  export let onRightClick: Function = null;
  onMount(async () => {
    document
      .getElementById(`row-header-${row.id}`)
      .addEventListener("contextmenu", (event: PointerEvent) => {
        event.preventDefault();
        onRightClick(event);
      });
  });
  </script>

<g transform="translate(0 {row.y})" id="row-header-{row.id}">
  <svg
    width={ROW_HEADER_WIDTH}
    height={row.height}
    class="cursor-grab hover:fill-teal-600 fill-teal-500"
  >
    <rect width={ROW_HEADER_WIDTH} height={row.height} stroke="black" />
    <text
      x={ROW_HEADER_WIDTH - 6}
      y={row.height / 2}
      text-anchor="end"
      class="fill-black"
      dominant-baseline="central"
      font-size="10pt">{row.name === null ? row.id : row.name}</text
    >
  </svg>
</g>
