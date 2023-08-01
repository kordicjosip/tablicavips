import { persisted } from 'svelte-local-storage-store';

const cachedStores: { [key: string]: any } = {};

export function getPersisted(key: string) {
	if (cachedStores[key]) {
		return cachedStores[key];
	}
	cachedStores[key] = persisted<null | any>(key, null);
	return cachedStores[key];
}
