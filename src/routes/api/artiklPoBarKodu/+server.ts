import { getArtiklPoBarKodu } from '$components/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const artikl = await getArtiklPoBarKodu(url.searchParams.get('barcode')!);
	return new Response(artikl ? JSON.stringify(artikl) : 'null', {
		headers: {
			'content-type': 'text/json'
		}
	});
};
