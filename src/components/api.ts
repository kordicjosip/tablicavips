export async function getArtiklPoSifri(text: string, fetch: any): Promise<any | null> {
	if (text === '') return null;
	const urlSearchParams = new URLSearchParams({ sifra: text });
	const artikl = await fetch('/api/artiklPoSifri?' + urlSearchParams.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());
	return artikl;
}

export async function getArtiklPoKataloskomBroju(text: string, fetch: any): Promise<any | null> {
	if (text === '') return null;
	const urlSearchParams = new URLSearchParams({ katBroj: text });
	const artikl = await fetch('/api/artiklPoKatBroju?' + urlSearchParams.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());
	return artikl;
}

export async function getArtiklPoBarKodu(text: string, fetch: any): Promise<any | null> {
	if (text === '') return null;
	const urlSearchParams = new URLSearchParams({ barcode: text });
	const artikl = await fetch('/api/artiklPoBarKodu?' + urlSearchParams.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());
	return artikl;
}
