<script lang="ts">
  import {
    COLUMN_HEADER_HEIGHT,
    DataTableCell,
    DataTableColumn,
    DataTableData,
    DataTableDataColumnType,
    DataTableRow,
    ROW_HEADER_WIDTH
  } from "../../components/DataTable";
  import "../../app.css";
  import RowHeader from "../../components/DataTable/RowHeader.svelte";
  import ColumnHeader from "../../components/DataTable/ColumnHeader.svelte";
  import DataTableCorner from "../../components/DataTable/DataTableCorner.svelte";
  import Cell from "../../components/DataTable/Cell.svelte";
  import ColumnHeaderDivider from "../../components/DataTable/ColumnHeaderDivider.svelte";
  import RowHeaderDivider from "../../components/DataTable/RowHeaderDivider.svelte";
  import { onMount } from "svelte";
  import { ContextMenu, ContextMenuDefinition, ContextMenuEntry, ContextMenuGroup } from "../../components/ContextMenu";

  export let show_column_header = true;
  export let show_row_header = true;

  export let high_performance = true;

  const X0 = show_row_header ? ROW_HEADER_WIDTH : 0;
  const Y0 = show_column_header ? COLUMN_HEADER_HEIGHT : 0;
  let X = show_row_header ? ROW_HEADER_WIDTH : 0;
  let Y = show_column_header ? COLUMN_HEADER_HEIGHT : 0;

  // TODO consider passing data to all objects, and storing everything in one object
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
      },
      {
        id: 4,
        name: null,
        x1:650,
        x2:850,
        get width() {return this.x2 - this.x1;}
      },
      {
        id: 5,
        name: "F",
        x1:850,
        x2:1050,
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
      },
      {
        id: 6,
        name: null,
        y1:250,
        y2:290,
        get height() {return this.y2 - this.y1;}
      },
      {
        id: 7,
        name: null,
        y1:290,
        y2:330,
        get height() {return this.y2 - this.y1;}
      },
      {
        id: 8,
        name: null,
        y1:330,
        y2:380,
        get height() {return this.y2 - this.y1;}
      },
      {
        id: 9,
        name: null,
        y1:380,
        y2:430,
        get height() {return this.y2 - this.y1;}
      }
    ],
    cells: []
  });

  // TODO set definition from cell
  let contextMenuDefinition = new ContextMenuDefinition();
  let testGroup = new ContextMenuGroup("Test group");
  testGroup.entries.push(
    new ContextMenuEntry("Test", "ico", () => {
      console.log("Clicked menu entry");
    })
  );
  contextMenuDefinition.groups.push(testGroup);

  function getCellFor(column: DataTableColumn, row: DataTableRow): DataTableCell | null {
    let found_cell = null;
    for (let cell of data.cells) {
      const cell_is_in_column = cell.columns.some(function(_column) {
        return _column == column;
      });
      const cell_is_in_row = cell.rows.some(function(_row) {
        return _row == row;
      });
      if (cell_is_in_column && cell_is_in_row) {
        found_cell = cell;
        break;
      }
    }
    return found_cell;
  }

  function createCellFor(column: DataTableColumn, row: DataTableRow): DataTableCell {
    const cell = new DataTableCell();
    cell.rows.push(row);
    cell.columns.push(column);
    return cell;
  }

  let cmX = 0;
  let cmY = 0;
  let cmShow = false;

  function showContextMenu(event: PointerEvent) {
    console.log(event);
    cmX = event.x;
    cmY = event.y;

    cmShow = true;

    // TODO set context options per cell so each cell can set it's menu options when clicked
  }

  function hideContextMenu() {
    cmShow = false;
  }

  onMount(async () => {
    document.getElementById("table").addEventListener("copy", (event) => {
      // TODO handle copy manually
      console.log(event);
    });

    // TODO maybe add event listener only when context menu is visible
    document.addEventListener("click", (event) => {
      // TODO handle copy manually
      console.log(event);
      if (cmShow == true) {
        // Ako je context menu vidljiv sakrij ga za 50ms (delay je kako bi se vidila animacija da je kliknuto)
        setTimeout(() => {
          hideContextMenu();
        }, 50);
      }
    });

    document.getElementById("table").addEventListener("mousewheel", (event: WheelEvent) => {
      hideContextMenu();
      // Na mouswheel pomičemo tablicu, oprobati na touchpadu i napraviti za touch pan
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
  <!-- BEGIN data -->
  <!-- TODO Add absolute positioned cell overlay -->
  <!-- TODO Test cell with image -->
  <g id="cells" transform="translate({X} {Y})">
    {#each data.rows as row}
      {#each data.columns as column}
        {#if getCellFor(column, row) === null}
          <Cell data={createCellFor(column, row)} />
        {/if}
      {/each}
    {/each}
    {#each data.cells as cell}
      <Cell bind:data={cell} />
    {/each}
  </g>
  <!-- END data -->

  <!-- BEGIN intractable elements -->
  <!-- BEGIN columns and rows -->
  <!-- TODO Scrollable -->
  <!-- TODO Join columns and column dividers -->
  <!-- TODO Select all cells member of column on click-->
  <g transform="translate({X} 0)">
    {#each data.columns as column}
      <ColumnHeader bind:column onRightClick={showContextMenu} />
    {/each}
  </g>
  <!-- TODO Join rows and row dividers -->
  <!-- TODO Select all cells on click corner -->
  <!-- TODO Select all cells member of row on click-->
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
  <!-- END column and row dividers -->
  <!-- END intractable elements -->

  <!-- TODO Select all cells on click corner -->
  <DataTableCorner height={Y0} width={X0} x={0} y={0} />
</svg>
<!-- START context menu -->
<ContextMenu definition={contextMenuDefinition} visible={cmShow} x={cmX} y={cmY} />
<!-- END context menu -->
