import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { getArtiklPoSifri } from '$components/api';
// @ts-ignore
import { Field } from '$components/VipsTableOCR/field';

export const load: PageLoad = async ({ params, fetch }) => {
	let table = {
		columns: [],
		tablica: []
	};
	if (browser) {
		table = JSON.parse(localStorage.getItem(params.doc_id)!);
		for (const columnIndex in table.columns) {
			if (table.columns[columnIndex].field === Field.artiklPoSifri) {
				for (const row of table.tablica) {
					row.cells[columnIndex].data = getArtiklPoSifri(row.cells[columnIndex]?.text | '', fetch);
				}
				await Promise.all(
					table.tablica.map(
						async (row) => (row.cells[columnIndex].data = await row.cells[columnIndex].data)
					)
				);
			}
		}
		console.log(table);
	}
	return {
		table
	};
};
