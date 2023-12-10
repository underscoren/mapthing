import { env } from '$env/dynamic/private';
import type { Cookies, RequestEvent } from '@sveltejs/kit';

export const authUser = (event: RequestEvent) => {
	validateCookie(event.cookies, event.locals);
};

export const validateCookie = (cookies: Cookies, locals: App.Locals) => {
	if (isValidAdmin(cookies)) {
		locals.auth = 'admin';
	}
};

export const isValidAdmin = (cookies: Cookies) => {
	return cookies.get('auth') == env.ADMIN_TOKEN;
};
