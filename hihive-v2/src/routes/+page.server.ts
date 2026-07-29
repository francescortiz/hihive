import { getHomeData } from '$lib/server/db';

export const prerender = true;

export async function load() {
  return getHomeData();
}