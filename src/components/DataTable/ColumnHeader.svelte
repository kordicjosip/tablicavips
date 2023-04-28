<script lang="ts">
  import "../../app.css";
  import { DataTableColumn, COLUMN_HEADER_HEIGHT } from "../../components/DataTable";
  import { onMount } from "svelte";

  export let column: DataTableColumn;
  export let onRightClick: Function = null;

  onMount(async () => {
    document
      .getElementById(`column-header-${column.id}`)
      .addEventListener("contextmenu", (event: PointerEvent) => {
        event.preventDefault();
        onRightClick(event);
      });
  });
</script>

<g transform="translate({column.x1} 0)" id="column-header-{column.id}">
  <svg
    width={column.width}
    height={COLUMN_HEADER_HEIGHT}
    class="cursor-grab hover:fill-teal-600 fill-teal-500"
  >
    <rect width={column.width} height={COLUMN_HEADER_HEIGHT} stroke="black" />
    <text
      x={column.width / 2}
      y={COLUMN_HEADER_HEIGHT / 2}
      text-anchor="middle"
      dominant-baseline="central"
      class="fill-black"
      font-size="10pt">{column.name}</text
    >
  </svg>
</g>
