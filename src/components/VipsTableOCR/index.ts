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

	selected = false;

	offset: number = 0;
	_x1: number = -1;
	_x2: number = -1;

	tableWidth: number = 0;

	setOffset(offset: number) {
		this.offset += offset;

		if (this.offset + this._x1 < 0) {
			this.offset = -this._x1;
		}
		if (this.offset + this._x2 > this.tableWidth) {
			this.offset = this.tableWidth - this._x2;
		}
	}

	get x1(): number {
		return this._x1 + this.offset;
	}

	set x1(value: number) {
		this._x1 = value;
	}

	get x2(): number {
		return this._x2 + this.offset;
	}

	set x2(value: number) {
		this._x2 = value;
	}

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
	private _isUnlinked: boolean = false;

	get isUnlinked(): boolean {
		return this._isUnlinked;
	}

	set isUnlinked(value: boolean) {
		if (!this._isUnlinked) {
			this._isUnlinked = value;
		}
	}

	constructor(data: TableDataInterface) {
		this.image = data.image;
		this.resolution = data.resolution;
		data.columns.forEach((column) => {
			this.addColumn(column);
		});
		data.rows.forEach((row) => {
			this.addRow(row);
		});
	}

	setOffset(offset: number) {
		this.columns.forEach((col) => {
			col.setOffset(offset);
		});
	}

	addColumn(column: TableColumnInterface) {
		const new_column = new TableColumn();

		new_column.id = this.columns.reduce((max, col) => (col.id > max ? col.id : max), -1) + 1;
		new_column.x1 = column.x1;
		new_column.x2 = column.x2;
		new_column.name = column.name;
		new_column.tableWidth = this.resolution[0];

		this.columns.push(new_column);
	}

	removeColumn(column: TableColumnInterface) {
		this.columns = this.columns.filter((col) => col.id !== column.id);
	}

	renameColumn(id: number, newName: string) {
		const col = this.columns.find((c) => c.id === id);
		if (col) {
			col.name = newName;
		}
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

export class TablesData {
	tables: TableData[] = [];
	currentPage: number = 0;

	get currentPageTable(): TableData | undefined {
		return this.tables[this.currentPage];
	}

	addColumn(column: TableColumnInterface) {
		if (this.currentPageTable) {
			this.currentPageTable.addColumn(column);
		}
	}

	removeColumn(column: TableColumnInterface) {
		if (this.currentPageTable) {
			this.currentPageTable.removeColumn(column);
		}
	}

	addRow(row: TableRowInterface) {
		if (this.currentPageTable) {
			this.currentPageTable.addRow(row);
		}
	}

	removeRow(row: TableRowInterface) {
		if (this.currentPageTable) {
			this.currentPageTable.removeRow(row);
		}
	}

	addTable(table: TableDataInterface) {
		this.tables.push(new TableData(table));
		if (this.tables.length === 1) {
			this.currentPage = 0;
		}
	}

	renameColumn(id: number, newName: string) {
		if (this.currentPageTable) {
			this.currentPageTable.renameColumn(id, newName);
		}
	}

	setOffset(offset: number) {
		if (this.currentPageTable) {
			this.currentPageTable.setOffset(offset);
		}
	}

	setOffsetColumnAllTables(id: number, offset: number) {
		this.tables.forEach((table) => {
			const col = table.columns.find((c) => c.id === id);
			if (col && !table.isUnlinked) {
				col.setOffset(offset);
			}
		});
	}

	setOffsetColumnsAllTables(offset: number) {
		this.tables.forEach((table) => {
			if (!table.isUnlinked) {
				table.setOffset(offset);
			}
		});
	}
}
