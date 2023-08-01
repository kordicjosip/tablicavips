// @ts-ignore
import { getArtiklPoBarKodu, getArtiklPoKataloskomBroju, getArtiklPoSifri } from '$components/api';
// @ts-ignore
import { Field } from '$components/VipsTableOCR/field';
// @ts-ignore
import { validateInputNumeric } from '$components/validators';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { getPersisted } from '$components/store';

export const load: PageLoad = async ({ params, fetch }) => {
	let table = {
		columns: [],
		tablica: []
	};
	if (browser) {
		const store = getPersisted(params.doc_id);
		table = get<any>(store);
		for (const columnIndex in table.columns) {
			switch (table.columns[columnIndex].field) {
				case Field.artiklPoSifri:
					for (const row of table.tablica) {
						row.cells[columnIndex].data = getArtiklPoSifri(
							row.cells[columnIndex]?.text || '',
							fetch
						);
					}
					await Promise.all(
						table.tablica.map(
							async (row) => (row.cells[columnIndex].data = await row.cells[columnIndex].data)
						)
					);
					break;
				case Field.artiklPoKataloskomBroju:
					for (const row of table.tablica) {
						row.cells[columnIndex].data = getArtiklPoKataloskomBroju(
							row.cells[columnIndex]?.text || '',
							fetch
						);
					}
					await Promise.all(
						table.tablica.map(
							async (row) => (row.cells[columnIndex].data = await row.cells[columnIndex].data)
						)
					);
					break;
				case Field.artiklPoBarKodu:
					for (const row of table.tablica) {
						row.cells[columnIndex].data = getArtiklPoBarKodu(
							row.cells[columnIndex]?.text || '',
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
	}
	return {
		table
	};
};
