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
  export let data = new DataTableData({
    columns: [
      {
        id: 0,
        name: null,
        x1:0,
        x2:180,
        get width() {return this.x2 - this.x1;}
      },
      {
        id: 1,
        name: null,
        x1:180,
        x2:300,
        get width() {return this.x2 - this.x1;}
      },
      {
        id: 2,
        name: null,
        x1:300,
        x2:450,
        get width() {return this.x2 - this.x1;}
      },
      {
        id: 3,
        name: "D",
        x1:450,
        x2:650,
        get width() {return this.x2 - this.x1;}
      }
    ],
    rows: [
      {
        id: 0,
        name: null,
        y1:0,
        y2:50,
        get height() {return this.y2 - this.y1;}
      },
      {
        id: 1,
        name: null,
        y1:50,
        y2:80,
        get height() {return this.y2 - this.y1;}
      },
      {
        id: 2,
        name: null,
        y1:80,
        y2:130,
        get height() {return this.y2 - this.y1;}
      },
      {
        id: 3,
        name: null,
        y1:130,
        y2:170,
        get height() {return this.y2 - this.y1;}
      },
      {
        id: 4,
        name: null,
        y1:170,
        y2:210,
        get height() {return this.y2 - this.y1;}
      },
      {
        id: 5,
        name: null,
        y1:210,
        y2:250,
        get height() {return this.y2 - this.y1;}
      }
    ]
  });

  let cmX = 0;
  let cmY = 0;
  let cmShow = false;

  function showContextMenu(event: PointerEvent) {
    console.log(event);
    cmX = event.x;
    cmY = event.y;

    cmShow = true;
  }

  function hideContextMenu() {
    cmShow = false;
  }

  onMount(async () => {
    document.getElementById("table").addEventListener("copy", (event) => {
      console.log(event);
    });

    document.addEventListener("click", (event) => {
      console.log(event);
      if (cmShow == true) {
        setTimeout(() => {
          hideContextMenu();
        }, 50);
      }
    });

    document.getElementById("table").addEventListener("mousewheel", (event: WheelEvent) => {
      hideContextMenu();
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
  });
</script>

<svg height="100%" id="table" width="100%">
  <g transform="translate({X} 0)">
    {#each data.columns as column}
      <ColumnHeader bind:column onRightClick={showContextMenu} />
    {/each}
  </g>
  <g transform="translate(0 {Y})">
    {#each data.rows as row}
      <RowHeader bind:row onRightClick={showContextMenu} />
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
</svg>
