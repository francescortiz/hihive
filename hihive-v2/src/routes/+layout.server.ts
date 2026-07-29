import { getSite } from '$lib/server/db';

export const prerender = true;
export const ssr = true;
export const csr = true;

export async function load() {
	return { site: getSite() };
}