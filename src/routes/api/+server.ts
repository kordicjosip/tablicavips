// @ts-ignore
import { testaaa } from '$components/db';

export async function GET() {
	return new Response(await testaaa());
}
