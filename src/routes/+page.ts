import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageLoad = async ({ fetch }) => {
	return {
		documents: fetch(`${PUBLIC_API_URL}/api/doc`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json())
	};
};
