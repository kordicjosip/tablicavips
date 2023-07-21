import type { Field } from './field';

export { default as VipsTableOCR } from './VipsTableOCR.svelte';

export const ROW_HEADER_WIDTH = 25;
export const COLUMN_HEADER_HEIGHT = 20;

export interface TableColumnInterface {
	id: number;
	type: { name: string; field: Field; parameter: string } | null;
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

export interface OCRInterface {
	text: string;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

export interface TableDataInterface {
	id: string;
	columns: TableColumnInterface[];
	rows: TableRowInterface[];
	resolution: number[];
	image: string;
	ocr: OCRInterface[];
	tableCrop: { x1: number; x2: number; y1: number; y2: number };
}

export class TableColumn {
	id: number = -1;
	name: string | null = null;
	type: { name: string; field: Field; parameter: string } | undefined;

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

	dragX1(offset: number) {
		this._x1 += offset;

		if (this.width < 1) {
			this.x2 = this.x1 - this.offset + 1;
		}
		if (this.offset + this._x1 < 0) {
			this.x1 = -this.offset;
		}
		if (this.offset + this._x2 > this.tableWidth) {
			this.offset = this.tableWidth - this._x2;
			this.x1 = this.x2 - this.offset - 20;
		}
	}

	dragX2(offset: number) {
		this._x2 += offset;

		if (this.width < 1) {
			this.x1 = this.x2 - this.offset + 1;
		}
		if (this.offset + this._x1 < 0) {
			this.x1 = -this.offset;
			this.x2 = -this.offset + 20;
		}
		if (this.offset + this._x2 > this.tableWidth) {
			this.x2 = this.tableWidth - this.offset;
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

export interface DokumentRed {
	cells: any[];
	disabled: boolean;
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

export class OCR {
	text: string;
	x1: number;
	x2: number;
	y1: number;
	y2: number;

	constructor(ocr: OCRInterface) {
		this.text = ocr.text;
		this.x1 = ocr.x1;
		this.x2 = ocr.x2;
		this.y1 = ocr.y1;
		this.y2 = ocr.y2;
	}
}

export class TableData {
	id: string;
	columns: TableColumn[] = [];
	rows: TableRow[] = [];
	resolution: number[] = [];
	image: string = '';
	private _isUnlinked: boolean = false;
	ocr: OCR[] = [];
	tableCrop: { x1: number; x2: number; y1: number; y2: number };

	get isUnlinked(): boolean {
		return this._isUnlinked;
	}

	set isUnlinked(value: boolean) {
		if (!this._isUnlinked) {
			this._isUnlinked = value;
		}
	}

	constructor(data: TableDataInterface) {
		this.id = data.id;
		this.image = data.image;
		this.resolution = data.resolution;
		this.tableCrop = data.tableCrop;
		data.columns.forEach((column) => {
			this.addColumn(column);
		});
		data.rows.forEach((row) => {
			this.addRow(row);
		});
		data.ocr.forEach((ocr) => {
			this.ocr.push(new OCR(ocr));
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
		new_column.type = column.type!;
		new_column.name = column.name;
		new_column.tableWidth = this.resolution[0];

		this.columns.push(new_column);
	}

	removeColumn(column: TableColumnInterface) {
		this.columns = this.columns.filter((col) => col.id !== column.id);
	}

	deleteColumns() {
		this.columns = [];
	}

	setColumnType(id: number, type: { name: string; field: Field; parameter: string }) {
		const col = this.columns.find((c) => c.id === id);
		for (const existingCol of this.columns) {
			if (existingCol.type === type) {
				return;
			}
		}
		if (col) {
			col.type = type;
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

	isOCRSelected(ocr: OCR) {
		return (
			this.columns.filter((column) => {
				return column.x1 <= ocr.x1 - this.tableCrop.x1 && column.x2 >= ocr.x2 - this.tableCrop.x1;
			}).length > 0 &&
			this.rows.filter((row) => {
				return row.y1 <= ocr.y1 - this.tableCrop.y1 && row.y2 >= ocr.y2 - this.tableCrop.y1;
			}).length > 0
		);
	}
}

export class TablesData {
	tables: TableData[] = [];
	currentPage: number = 0;

	get currentPageTable(): TableData | undefined {
		return this.tables[this.currentPage];
	}

	addColumn(column: TableColumnInterface) {
		if (this.currentPageTable?.isUnlinked) {
			this.currentPageTable.addColumn(column);
		} else {
			this.tables.forEach((table) => {
				if (!table.isUnlinked) {
					table.addColumn(column);
				}
			});
		}
	}

	removeColumn(column: TableColumnInterface) {
		this.tables.forEach((table) => {
			if (this.currentPageTable?.isUnlinked) {
				this.currentPageTable.removeColumn(column);
			} else {
				if (!table.isUnlinked) {
					table.removeColumn(column);
				}
			}
		});
	}

	deleteColumnsAllTables() {
		this.tables.forEach((table) => {
			if (!table.isUnlinked) {
				table.deleteColumns();
			}
		});
	}

	addColumnsAllTables(column: TableColumnInterface) {
		this.tables.forEach((table) => {
			if (!table.isUnlinked) {
				table.addColumn(column);
			}
		});
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

	addTable(table: TableData) {
		this.tables.push(table);
		if (this.tables.length === 1) {
			this.currentPage = 0;
		}
	}

	setColumnType(id: number, type: { name: string; field: Field; parameter: string }) {
		this.tables.forEach((table) => {
			if (this.currentPageTable?.isUnlinked) {
				this.currentPageTable.setColumnType(id, type);
			} else {
				if (!table.isUnlinked) {
					table.setColumnType(id, type);
				}
			}
		});
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

	dragX1AllTables(id: number, offset: number) {
		this.tables.forEach((table) => {
			const col = table.columns.find((c) => c.id === id);
			if (col && !table.isUnlinked) {
				col.dragX1(offset);
			}
		});
	}

	dragX2AllTables(id: number, offset: number) {
		this.tables.forEach((table) => {
			const col = table.columns.find((c) => c.id === id);
			if (col && !table.isUnlinked) {
				col.dragX2(offset);
			}
		});
	}
}
