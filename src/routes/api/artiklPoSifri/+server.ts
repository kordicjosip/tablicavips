// @ts-ignore
import { getArtiklPoSifri } from '$components/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const artikl = await getArtiklPoSifri(url.searchParams.get('sifra'));
	return new Response(artikl ? JSON.stringify(artikl) : 'null', {
		headers: {
			'content-type': 'text/json'
		}
	});
};
