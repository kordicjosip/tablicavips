export { default as DataTable } from "../../components/DataTable/DataTable.svelte";

export const ROW_HEADER_WIDTH = 32;
export const COLUMN_HEADER_HEIGHT = 30;

export enum DataTableDataColumnType {
  String = "string",
  Number = "number"
}

export interface DataTableColumnInterface {
  x1: number;
  x2: number;
}

export interface DataTableRowInterface {
  y1: number;
  y2: number;
}

export interface DataTableDataInterface {
  columns: DataTableColumnInterface[];
  rows: DataTableRowInterface[];
}

export class DataTableColumn {
  x1: number = -1;
  x2: number = -1;
}

export class DataTableRow {
  y1: number = -1;
  y2: number = -1;
}

export class DataTableData {
  columns: DataTableColumn[] = [];
  rows: DataTableRow[] = [];

  constructor(data: DataTableDataInterface) {
    data.columns.forEach((column) => {
      this.addColumn(column);
    });
    data.rows.forEach((row) => {
      this.addRow(row);
    });
  }

  recalculateColumns() {
    let x = 0;
    this.columns.forEach((column) => {
      column.x1 = x;
      x += column.x2-column.x1;
    });
  }
  recalculateRows() {
    let y = 0;
    this.rows.forEach((row) => {
      row.y1 = y;
      y += row.y2-row.y1;
    });
  }

  addColumn(column: DataTableColumnInterface) {
    const new_column = new DataTableColumn();

    new_column.x1 = column.x1;
    new_column.x2 = column.x2;

    let x = 0;
    this.columns.forEach(({ x1 }) => {
      x += column.x2-column.x1;
    });
    new_column.x1 = x;

    this.columns.push(new_column);
  }

  addRow(row: DataTableRowInterface) {
    const new_row = new DataTableRow();

    new_row.y1 = row.y1;
    new_row.y2 = row.y2;

    let y = 0;
    this.rows.forEach(({ y1 }) => {
      y += row.y2-row.y1;
    });
    new_row.y1 = y;

    this.rows.push(new_row);
  }
}
