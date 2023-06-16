import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	return {
		id: params.doc_id,
		documentData: fetch(`http://192.168.10.20:8000/api/doc/${params.doc_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json())
	};
};
