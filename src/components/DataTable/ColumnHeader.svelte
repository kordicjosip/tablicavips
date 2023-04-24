<script lang="ts">
  import { DataTableColumn, COLUMN_HEADER_HEIGHT } from "../../components/DataTable";
  import { onMount } from "svelte";

  const ALPHABET = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];

  export let column: DataTableColumn;
  export let onRightClick: Function = null;

  onMount(async () => {
    document
      .getElementById(`column-header-${column.x1}`)
      .addEventListener("contextmenu", (event: PointerEvent) => {
        event.preventDefault();
        onRightClick(event);
        // TODO set context menu
      });
  });
</script>

<g transform="translate({column.x1} 0)" id="column-header-{column.x1}">
  <svg
    width={column.x2-column.x1}
    height={COLUMN_HEADER_HEIGHT}
    class="cursor-grab hover:fill-cyan-600 fill-cyan-500"
  >
    <rect width={column.x2-column.x1} height={COLUMN_HEADER_HEIGHT} stroke="black" />
    <text
      x={(column.x2-column.x1) / 2}
      y={COLUMN_HEADER_HEIGHT / 2}
      text-anchor="middle"
      dominant-baseline="central"
      class="fill-black"
      font-size="10pt">123</text
    >
  </svg>
</g>
