import type { PageLoad } from './$types';
import { browser } from '$app/environment';

export const load: PageLoad = ({ params }) => {
	return {
		table: browser ? JSON.parse(localStorage.getItem(params.doc_id)!) : null
	};
};
