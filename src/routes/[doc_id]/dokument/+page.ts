// @ts-ignore
import { getArtiklPoSifri } from '$components/api';
// @ts-ignore
import { Field } from '$components/VipsTableOCR/field';
// @ts-ignore
import { validateInputNumeric } from '$components/validators';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';

export const load: PageLoad = async ({ params, fetch }) => {
	let table = {
		columns: [],
		tablica: []
	};
	if (browser) {
		table = JSON.parse(localStorage.getItem(params.doc_id)!);
		for (const columnIndex in table.columns) {
			switch (table.columns[columnIndex].field) {
				case Field.artiklPoSifri:
					for (const row of table.tablica) {
						row.cells[columnIndex].data = getArtiklPoSifri(
							row.cells[columnIndex]?.text | '',
							fetch
						);
					}
					await Promise.all(
						table.tablica.map(
							async (row) => (row.cells[columnIndex].data = await row.cells[columnIndex].data)
						)
					);
					break;
				case Field.numeric:
					for (const row of table.tablica) {
						row.cells[columnIndex].data = validateInputNumeric(row.cells[columnIndex]?.text);
					}
					break;
				case Field.text:
					for (const row of table.tablica) {
						row.cells[columnIndex].data = row.cells[columnIndex]?.text;
					}
			}
		}
		console.log(table);
	}
	return {
		table
	};
};
