import type { PageLoad } from './$types';
import { browser } from '$app/environment';

export const load: PageLoad = ({ params }) => {
	let table = {
		columns: [],
		tablica: []
	};
	if (browser) {
		table = JSON.parse(localStorage.getItem(params.doc_id)!);
	}
	return {
		table
	};
};
