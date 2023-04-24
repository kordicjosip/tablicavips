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
  width: number;
}

export interface DataTableRowInterface {
  id: number;
  name: string | null;
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
  // TODO Data type - priority above all
  // TODO action - sort, filter, collapse
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

  // TODO optimize
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
  // TODO Data type - priority below all
  id: number = -1;
  name: string | null = null;
  width: number = -1;
  x: number = -1;
}

export class DataTableRow {
  // TODO Data type - priority above column, below cell
  // TODO class - Table member, page header, page footer, document header, document footer
  id: number = -1;
  name: string | null = null;
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
    data.cells.forEach((cell) => {
      this.addCell(cell);
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
    new_row.height = row.height;
    new_row.name = row.name;

    let y = 0;
    this.rows.forEach(({ height }) => {
      y += height;
    });
    new_row.y = y;

    this.rows.push(new_row);
  }

  addCell(cell: DataTableCellInterface) {
    const new_cell = new DataTableCell();

    cell.row_ids.forEach((row_id) => {
      this.rows.forEach((row) => {
        if (row.id == row_id) {
          new_cell.rows.push(row);
        }
      });
    });

    cell.column_ids.forEach((column_id) => {
      this.columns.forEach((column) => {
        if (column.id == column_id) {
          new_cell.columns.push(column);
        }
      });
    });

    this.cells.push(new_cell);
  }
}
