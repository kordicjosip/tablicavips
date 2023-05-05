<script lang="ts">
  import {
    COLUMN_HEADER_HEIGHT,
    ROW_HEADER_WIDTH,
    DataTableData
  } from "./index.ts";
  import "../../app.css";
  import RowHeader from "../../components/DataTable/RowHeader.svelte";
  import ColumnHeader from "../../components/DataTable/ColumnHeader.svelte";
  import DataTableCorner from "../../components/DataTable/DataTableCorner.svelte";
  import ColumnHeaderDivider from "../../components/DataTable/ColumnHeaderDivider.svelte";
  import RowHeaderDivider from "../../components/DataTable/RowHeaderDivider.svelte";
  import { onMount } from "svelte";
  import { ContextMenu, ContextMenuDefinition, ContextMenuEntry, ContextMenuGroup } from "../../components/ContextMenu";
  import ColumnHeaderBackground from "./ColumnHeaderBackground.svelte";
  import RowHeaderBackground from "./RowHeaderBackground.svelte";

  export let show_column_header = true;
  export let show_row_header = true;

  const X0 = show_row_header ? ROW_HEADER_WIDTH : 0;
  const Y0 = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
  let X = show_row_header ? ROW_HEADER_WIDTH : 0;
  let Y = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
  let res = [];
  let data: DataTableData|null = null;
  let trenutnaStranica: null|number = 0;

  let contextMenuDefinitionRows = new ContextMenuDefinition();
  let contextMenuDefinitionCols = new ContextMenuDefinition();
  let rowContextMenu = new ContextMenuGroup("Context menu za redove");
  rowContextMenu.entries.push(
          new ContextMenuEntry("Dodaj red", "ico", ()=> {
              data?.addRow({
                id: Number(data?.rows.length),
                name: "row",
                y1: cmY-COLUMN_HEADER_HEIGHT,
                y2: cmY-COLUMN_HEADER_HEIGHT + 50
              });
              data = data;
          })
  );
  let columnContextMenu = new ContextMenuGroup("Context menu za stupce");
  columnContextMenu.entries.push(
          new ContextMenuEntry("Dodaj stupac", "ico", ()=> {
            data?.addColumn({
              id: Number(data?.rows.length),
              name: "column",
              x1: cmX-ROW_HEADER_WIDTH,
              x2: cmX-ROW_HEADER_WIDTH+50
            });
            data = data;
          })
  );
  let cmX = 0;
  let cmY = 0;
  let cmShowRows = false;
  let cmShowCols = false;
  function showContextMenuRows(event: PointerEvent) {
    cmX = event.x;
    cmY = event.y;
    cmShowRows=true;
  }
  function showContextMenuCols(event: PointerEvent) {
    cmX = event.x;
    cmY = event.y;
    cmShowCols=true;
  }
  function hideContextMenu() {
    cmShowRows = false;
    cmShowCols = false;
  }

  contextMenuDefinitionCols.groups.push(columnContextMenu);
  contextMenuDefinitionRows.groups.push(rowContextMenu);

  onMount(async () => {
    res = await (await fetch("/data.json")).json()
    const columns = res[trenutnaStranica].columns.map((column, index) => {
      return {
        id: index,
        name: "column",
        x1: column[0],
        x2: column[1],
        get width() {return this.x2 - this.x1;}
      }
    });
    const rows = res[trenutnaStranica].rows.map((row, index) => {
      return {
        id: index,
        name: "row",
        y1: row[0],
        y2: row[1]
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

    document.addEventListener("click", (event) => {
      if (cmShowCols == true || cmShowRows == true) {
        setTimeout(() => {
          hideContextMenu();
        }, 50);
      }
    });
  });

</script>
<svg height="100%" id="table" width="100%">
  {#if data}
  <image href="{data.image}" width={data.resolution[0]} height={data.resolution[1]} transform="translate({X0} {Y0})"></image>

    <!-- HEADERS COLUMNS -->
  <g transform="translate({X} 0)">
    <ColumnHeaderBackground onRightClick={showContextMenuCols}/>
    {#each data.columns as column}
      <ColumnHeader bind:column onRightClick={showContextMenuCols}/>
    {/each}
  </g>
    <!-- HEADERS ROWS -->
    <rect id="header" height="100%" width="25" color="black"></rect>
  <g transform="translate(0 {Y})">
    <RowHeaderBackground onRightClick={showContextMenuCols}/>
    {#each data.rows as row}
      <RowHeader bind:row onRightClick={showContextMenuRows} />
    {/each}
  </g>
  <!-- END columns and rows -->

  <!-- BEGIN column and row dividers -->
  <g transform="translate({X} 0)">
    {#each data.columns as column}
      <ColumnHeaderDivider bind:column />
    {/each}
  </g>

  <g transform="translate(0 {Y})">
    {#each data.rows as row}
      <RowHeaderDivider bind:row />
    {/each}
  </g>

  <DataTableCorner height={Y0} width={X0} x={0} y={0} />
    {/if}
</svg>

<ContextMenu definition={contextMenuDefinitionCols} visible={cmShowCols} x={cmX} y={cmY} />
<ContextMenu definition={contextMenuDefinitionRows} visible={cmShowRows} x={cmX} y={cmY} />