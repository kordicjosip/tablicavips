<script lang="ts">
  import {
    COLUMN_HEADER_HEIGHT,
    ROW_HEADER_WIDTH,
    DataTableData
  } from "../../components/DataTable";
  import "../../app.css";
  import RowHeader from "../../components/DataTable/RowHeader.svelte";
  import ColumnHeader from "../../components/DataTable/ColumnHeader.svelte";
  import DataTableCorner from "../../components/DataTable/DataTableCorner.svelte";
  import ColumnHeaderDivider from "../../components/DataTable/ColumnHeaderDivider.svelte";
  import RowHeaderDivider from "../../components/DataTable/RowHeaderDivider.svelte";
  import { onMount } from "svelte";

  export let show_column_header = true;
  export let show_row_header = true;
  export let high_performance = true;

  const X0 = show_row_header ? ROW_HEADER_WIDTH : 0;
  const Y0 = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
  let X = show_row_header ? ROW_HEADER_WIDTH : 0;
  let Y = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
  let res = [];
  let data: DataTableData|null = null;
  let trenutnaStranica: null|number = 0;
  $: {
    if (res.length > 0){
      const columns = res[trenutnaStranica].columns.map((column, index) => {
        return {
          id: index,
          name: "naziv",
          x1: column[0],
          x2: column[1],
          get width() {return this.x2 - this.x1;}
        }
      });
      const rows = res[trenutnaStranica].rows.map((row, index) => {
        return {
          id: index,
          name: "naziv",
          y1: row[0],
          y2: row[1],
          get height() {return this.y2 - this.y1;}
        }
      });
      const resolution = res[trenutnaStranica].resolution;
      const image = res[trenutnaStranica].image;
      data = new DataTableData({
        columns: columns,
        rows: rows,
        resolution: resolution,
        image: image
      });
    }
  }

  onMount(async () => {
    document.getElementById("table").addEventListener("copy", (event) => {
      console.log(event);
    });

    document.getElementById("table").addEventListener("mousewheel", (event: WheelEvent) => {
      if (event.shiftKey) {
        // noinspection JSSuspiciousNameCombination Ako je shift pritisnut, scroll rotiramo za 90°
        Y -= event.deltaX;
        // noinspection JSSuspiciousNameCombination Ako je shift pritisnut, scroll rotiramo za 90°
        X -= event.deltaY;
      } else {
        Y -= event.deltaY;
        X -= event.deltaX;
      }
      if (X > X0) X = X0;
      if (Y > Y0) Y = Y0;
    });

    res = await (await fetch("/data.json")).json()

  });
</script>
<svg height="100%" id="table" width="100%">
  {#if data}
  <image href="{data.image}" width={data.resolution[0]} height={data.resolution[1]} transform="translate({X0} {Y0})"></image>
  <g transform="translate({X} 0)">
    {#each data.columns as column}
      <ColumnHeader bind:column />
    {/each}
  </g>
  <g transform="translate(0 {Y})">
    {#each data.rows as row}
      <RowHeader bind:row />
    {/each}
  </g>
  <!-- END columns and rows -->

  <!-- BEGIN column and row dividers -->
  <g transform="translate({X} 0)">
    {#each data.columns as column}
      <ColumnHeaderDivider bind:high_performance bind:column bind:dataTable={data} />
    {/each}
  </g>

  <g transform="translate(0 {Y})">
    {#each data.rows as row}
      <RowHeaderDivider bind:high_performance bind:row bind:dataTable={data} />
    {/each}
  </g>

  <DataTableCorner height={Y0} width={X0} x={0} y={0} />
    {/if}
</svg>