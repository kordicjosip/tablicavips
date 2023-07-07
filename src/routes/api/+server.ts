// @ts-ignore
import { sendDataToVips } from '$components/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async () => {
	const result = await sendDataToVips();
	return json(result);
}) satisfies RequestHandler;
