export async function getArtiklPoSifri(text: string, fetch: any) {
	const urlSearchParams = new URLSearchParams({ sifra: text });
	const artikl = await fetch('/api/artiklPoSifri?' + urlSearchParams.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());
	return artikl;
}
