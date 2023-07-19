import type { RequestHandler } from '@sveltejs/kit';
import { getVipsDocument } from '$components/db';

export const GET: RequestHandler = async ({ params }) => {
	console.log(params);
	const dokument = await getVipsDocument(params.document);
	return new Response(dokument ? JSON.stringify(dokument) : 'null', {
		headers: {
			'content-type': 'text/json'
		}
	});
};
