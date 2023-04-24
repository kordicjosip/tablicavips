<script lang="ts">
  import { DataTableCell } from "../../components/DataTable";
  import "../../app.css";

  export let data: DataTableCell;
</script>

<g transform="translate({data.x} {data.y})">
  <rect
    width={data.width}
    height={data.height}
    fill="none"
    stroke="black"
    class="cursor-grab hover:outline-indigo-600 outline-dotted outline-2 outline-transparent"
  />
  <svg width={data.width} height={data.height}>
    <text
      x={data.width / 2}
      y={data.height / 2}
      text-anchor="middle"
      dominant-baseline="central"
      font-size="10pt">Test</text
    >
  </svg>
</g>
