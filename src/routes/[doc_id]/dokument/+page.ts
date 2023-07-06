import type { PageLoad } from './$types';
import { browser } from '$app/environment';

export const load: PageLoad = ({ params }) => {
	let table: string[][] = [];
	if (browser) {
		const columns: string[] = [];
		const rows: string[] = [];
		const tableData: any[] = JSON.parse(localStorage.getItem(params.doc_id)!);
		tableData.forEach((td) => {
			if (!(td.colName in columns)) {
				columns.push(td.colName);
			}
		});
		tableData.forEach((td) => {
			if (!(td.rowNumber in rows)) {
				rows.push(td.rowNumber);
			}
		});
		for (let i = 0; i < rows.length; i++) {
			table[i] = [];
			for (let col of columns) {
				const cell = tableData.find((td) => td.colName === col && td.rowNumber === rows[i]);
				table[i].push(cell.text);
			}

			table[i].push('disabled');
		}
	}
	return {
		table
	};
};
