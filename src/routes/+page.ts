import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	return {
		documents: fetch('http://192.168.10.20:8000/api/doc', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json())
	};
};
