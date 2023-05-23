export { default as DataTable } from '../../components/DataTable/DataTable.svelte';

export const ROW_HEADER_WIDTH = 25;
export const COLUMN_HEADER_HEIGHT = 20;

export interface DataTableColumnInterface {
	id: number;
	name: string | null;
	x1: number;
	x2: number;
}

export interface DataTableRowInterface {
	id: number;
	name: string | null;
	y1: number;
	y2: number;
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
	get width(): number {
		return this.x2 - this.x1;
	}
}

export class DataTableRow {
	id: number = -1;
	name: string | null = null;
	y1: number = -1;
	y2: number = -1;
	get height(): number {
		return this.y2 - this.y1;
	}
}

export class DataTableData {
	columns: DataTableColumn[] = [];
	rows: DataTableRow[] = [];
	resolution: number[] = [];
	image: string = '';

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

	addColumn(column: DataTableColumnInterface) {
		const new_column = new DataTableColumn();

		new_column.id = this.columns.length;
		new_column.x1 = column.x1;
		new_column.x2 = column.x2;
		new_column.name = column.name;

		this.columns.push(new_column);
	}

	removeColumn(column: DataTableColumnInterface) {
		this.columns = this.columns.filter((col) => col.id !== column.id);
	}

	addRow(row: DataTableRowInterface) {
		const new_row = new DataTableRow();

		new_row.id = this.rows.length;
		new_row.y1 = row.y1;
		new_row.y2 = row.y2;
		new_row.name = row.name;

		this.rows.push(new_row);
	}

	removeRow(row: DataTableRowInterface) {
		this.rows = this.rows.filter((r) => r.id !== row.id);
	}
}
