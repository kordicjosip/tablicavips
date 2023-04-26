export { default as DataTable } from "../../components/DataTable/DataTable.svelte";

export const ROW_HEADER_WIDTH = 32;
export const COLUMN_HEADER_HEIGHT = 20;

export enum DataTableDataColumnType {
  String = "string",
  Number = "number"
}

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

export interface DataTableCellInterface {
  column_ids: number[];
  row_ids: number[];
  type: DataTableDataColumnType;
}

export interface DataTableDataInterface {
  columns: DataTableColumnInterface[];
  rows: DataTableRowInterface[];
  cells: DataTableCellInterface[];
}

export class DataTableCell {
  columns: DataTableColumn[] = [];
  rows: DataTableRow[] = [];

  get width(): number {
    let width = 0;
    this.columns.forEach((column) => {
      width += column.width;
    });
    return width;
  }

  get height(): number {
    let height = 0;
    this.rows.forEach((row) => {
      height += row.height;
    });
    return height;
  }

  get x(): number {
    let lowest = -1;
    this.columns.forEach((column) => {
      if (column.x < lowest || lowest == -1) {
        lowest = column.x;
      }
    });
    return lowest;
  }

  get y(): number {
    let lowest = -1;
    this.rows.forEach((row) => {
      if (row.y < lowest || lowest == -1) {
        lowest = row.y;
      }
    });
    return lowest;
  }
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
  cells: DataTableCell[] = [];

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
