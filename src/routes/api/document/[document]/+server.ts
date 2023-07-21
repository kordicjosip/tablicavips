// @ts-ignore
import { getVipsDocument } from '$components/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const dokument = await getVipsDocument(params.document);
	return new Response(dokument ? JSON.stringify(dokument) : 'null', {
		headers: {
			'content-type': 'text/json'
		}
	});
};
