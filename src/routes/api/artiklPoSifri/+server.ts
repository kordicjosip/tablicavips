// @ts-ignore
import { getArtiklPoSifri } from '$components/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const artiklID = await getArtiklPoSifri(url.searchParams.get('sifra'));
	return new Response(JSON.stringify({ artiklID }), {
		headers: {
			'content-type': 'text/json'
		}
	});
};
