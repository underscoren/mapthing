import { isValidAdmin } from '$lib/server/auth';
import { db } from '$lib/server/mongo';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { PendingMarkerData } from '../..';
import { ObjectId } from 'mongodb';

export const POST: RequestHandler = async ({ cookies, request }) => {
	if (!isValidAdmin(cookies)) throw error(401);

	const { id, verdict } = await request.json();
	if (!id || !verdict) throw error(400);

	const pendingMarker = (await db
		.collection('pending')
		.findOne({ _id: new ObjectId(id) })) as PendingMarkerData | null;
	if (!pendingMarker) throw error(500, 'does not exist');

	const markerData = {
		lat: pendingMarker.lat,
		lng: pendingMarker.lng,
		text: pendingMarker.textHTML
	};

	const result1 = await db.collection('messages').insertOne(markerData);
	if (!result1?.acknowledged || !result1?.insertedId) throw error(500);

	const result2 = await db.collection('pending').deleteOne({ _id: new ObjectId(id) });
	if (!result2?.acknowledged || !result2?.deletedCount) throw error(500);

	return json({ success: true });
};
