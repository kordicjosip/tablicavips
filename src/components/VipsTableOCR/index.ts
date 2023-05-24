export { default as VipsTableOCR } from './VipsTableOCR.svelte';

export const ROW_HEADER_WIDTH = 25;
export const COLUMN_HEADER_HEIGHT = 20;

export interface TableColumnInterface {
	id: number;
	name: string | null;
	x1: number;
	x2: number;
}

export interface TableRowInterface {
	id: number;
	name: string | null;
	y1: number;
	y2: number;
}

export interface TableDataInterface {
	columns: TableColumnInterface[];
	rows: TableRowInterface[];
	resolution: number[];
	image: string;
}

export class TableColumn {
	id: number = -1;
	name: string | null = null;
	x1: number = -1;
	x2: number = -1;
	get width(): number {
		return this.x2 - this.x1;
	}
}

export class TableRow {
	id: number = -1;
	name: string | null = null;
	y1: number = -1;
	y2: number = -1;
	get height(): number {
		return this.y2 - this.y1;
	}
}

export class TableData {
	columns: TableColumn[] = [];
	rows: TableRow[] = [];
	resolution: number[] = [];
	image: string = '';

	constructor(data: TableDataInterface) {
		data.columns.forEach((column) => {
			this.addColumn(column);
		});
		data.rows.forEach((row) => {
			this.addRow(row);
		});
		this.image = data.image;
		this.resolution = data.resolution;
	}

	addColumn(column: TableColumnInterface) {
		const new_column = new TableColumn();

		new_column.id = this.columns.reduce((max, col) => (col.id > max ? col.id : max), -1) + 1;
		new_column.x1 = column.x1;
		new_column.x2 = column.x2;
		new_column.name = column.name;

		this.columns.push(new_column);
	}

	removeColumn(column: TableColumnInterface) {
		this.columns = this.columns.filter((col) => col.id !== column.id);
	}

	addRow(row: TableRowInterface) {
		const new_row = new TableRow();

		new_row.id = this.rows.reduce((max, row) => (row.id > max ? row.id : max), -1) + 1;
		new_row.y1 = row.y1;
		new_row.y2 = row.y2;
		new_row.name = row.name;

		this.rows.push(new_row);
	}

	removeRow(row: TableRowInterface) {
		this.rows = this.rows.filter((r) => r.id !== row.id);
	}
}
