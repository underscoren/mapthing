import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { validateCookie } from '$lib/server/auth';
import { db } from '$lib/server/mongo';
import type { PendingMarkerData } from '..';
import { fixID } from '$lib/util';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	validateCookie(cookies, locals);

	console.log('pageServerLoad admin');
	console.log(locals);

	if (!locals.auth) {
		throw redirect(303, '/admin/login');
	}

	const pending = (await db.collection('pending').find({}).toArray()).map(
		fixID
	) as PendingMarkerData[];

	return { pending };
};
