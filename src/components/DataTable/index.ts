export { default as DataTable } from "../../components/DataTable/DataTable.svelte";

export const ROW_HEADER_WIDTH = 25;
export const COLUMN_HEADER_HEIGHT = 20;

export interface DataTableColumnInterface {
  id: number;
  name: string | null;
  x1: number;
  x2: number;
  width: number;
}

export interface DataTableRowInterface {
  id: number;
  name: string | null;
  y1: number;
  y2: number;
  height: number;
}


export interface DataTableDataInterface {
  columns: DataTableColumnInterface[];
  rows: DataTableRowInterface[];
  resolution: number[];
  image: string;
}

export class DataTableColumn {
  id: number = -1;
  name: string | null = null;
  x1: number = -1;
  x2: number = -1;
  width: number = -1;
  x: number = -1;
}

export class DataTableRow {
  id: number = -1;
  name: string | null = null;
  y1: number = -1;
  y2: number = -1;
  height: number = -1;
  y: number = -1;
}

export class DataTableData {
  columns: DataTableColumn[] = [];
  rows: DataTableRow[] = [];
  resolution: number[] = [];
  image: string = "";

  constructor(data: DataTableDataInterface) {
    data.columns.forEach((column) => {
      this.addColumn(column);
    });
    data.rows.forEach((row) => {
      this.addRow(row);
    });
    this.image = data.image;
    this.resolution = data.resolution;
  }

  recalculateColumns() {
    let x = 0;
    this.columns.forEach((column) => {
      column.x = x;
      x += column.width;
    });
  }
  recalculateRows() {
    let y = 0;
    this.rows.forEach((row) => {
      row.y = y;
      y += row.height;
    });
  }

  addColumn(column: DataTableColumnInterface) {
    const new_column = new DataTableColumn();

    new_column.id = column.id;
    new_column.x1 = column.x1;
    new_column.x2 = column.x2;
    new_column.width = column.width;
    new_column.name = column.name;

    let x = 0;
    this.columns.forEach(({ width }) => {
      x += width;
    });
    new_column.x = x;

    this.columns.push(new_column);
  }

  addRow(row: DataTableRowInterface) {
    const new_row = new DataTableRow();

    new_row.id = row.id;
    new_row.y1 = row.y1;
    new_row.y2 = row.y2;
    new_row.height = row.height;
    new_row.name = row.name;

    let y = 0;
    this.rows.forEach(({ height }) => {
      y += height;
    });
    new_row.y = y;

    this.rows.push(new_row);
  }
}
