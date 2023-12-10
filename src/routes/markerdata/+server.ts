import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/mongo';

export const GET: RequestHandler = async ({ url }) => {
	const lat = url.searchParams.get('lat');
	if (!lat) throw error(400, { message: 'lat missing' });
	const lng = url.searchParams.get('lng');
	if (!lng) throw error(400, { message: 'lng missing' });
	const radius = url.searchParams.get('r');
	if (!radius) throw error(400, { message: 'r missing' });

	const data = await db.collection('messages').find({});

	return json(await data.toArray());
};
