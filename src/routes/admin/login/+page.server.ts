import { db } from '$lib/server/mongo';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { compare } from 'bcrypt';
import type { Document, WithId } from 'mongodb';
import { env } from '$env/dynamic/private';

export const actions = {
	auth: async ({ cookies, request, locals }) => {
		const formData = await request.formData();
		const password = formData?.get('auth');
		if (!password || typeof password != 'string') throw fail(400, { error: 'Missing data' });

		type AuthDetails = WithId<Document> & {
			hash: string;
			type: string;
		};

		const result = (await db.collection('auth').findOne({ type: 'admin' })) as AuthDetails;

		const hashMatches = await compare(password, result.hash);
		console.log(hashMatches);

		if (hashMatches) {
			console.log('auth correct');
			cookies.set('auth', env.ADMIN_TOKEN ?? 'changeme', {
				httpOnly: true,
				secure: true,
				path: '/',
				sameSite: true,
				expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // one day
			});

			locals.auth = 'admin';

			throw redirect(303, '/admin');
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
