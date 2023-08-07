import { persisted } from 'svelte-local-storage-store';
import type { Writable } from 'svelte/store';

const cachedStores: { [key: string]: any } = {};

export function getPersisted<T>(key: string, defaultValue: T | null = null): Writable<T | null> {
	if (cachedStores[key]) {
		return cachedStores[key];
	}
	cachedStores[key] = persisted<null | T>(key, defaultValue);
	return cachedStores[key];
}

export const povezaniDokumenti = getPersisted<any[]>('povezaniDokumenti', []);
