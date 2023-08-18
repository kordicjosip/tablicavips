import type { LayoutLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: LayoutLoad = async ({ params, fetch }) => {
	return {
		id: params.doc_id,
		documentData: fetch(`${PUBLIC_API_URL}/api/doc/${params.doc_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json())
	};
};
