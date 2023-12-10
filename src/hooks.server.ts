import type { Handle } from '@sveltejs/kit';
import { authUser } from '$lib/server/auth';
import { startMongoDB } from '$lib/server/mongo';

await startMongoDB();

export const handler: Handle = async ({ event, resolve }) => {
	authUser(event);

	return await resolve(event);
};
