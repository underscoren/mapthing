import { error, json, type RequestHandler } from '@sveltejs/kit';
import DOMPurify from 'isomorphic-dompurify';
import { parse } from 'marked';
import { db } from '$lib/server/mongo';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const body = await request.json();
	if (!body) throw error(400, 'Request body missing');

	const { pos, text } = body;
	if (!pos) throw error(400, 'Position missing');

	const { lat, lng } = pos;
	if (!lat || !lng || !text) throw error(400, 'You need to write something!');

	if (typeof lat != 'number' || typeof lng != 'number' || isNaN(lat) || isNaN(lng))
		throw error(400, 'Latitute/Longitude is not a number');

	const headers = request.headers;
	const source = getClientAddress();

	const clean = DOMPurify.sanitize(parse(text));

	const data = {
		lat,
		lng,
		textRaw: text,
		textHTML: clean,
		source: {
			ip: source,
			headers: [...headers.entries()].map(([a, b]) => `${a}: ${b}`)
		}
	};

	console.dir(data);

	const result = await db.collection('pending').insertOne(data);

	if (result.acknowledged && result.insertedId != null)
		return json({ success: true, contents: clean });
	else throw error(500, 'Server error, something went wrong on our side. Maybe try again?');
};
