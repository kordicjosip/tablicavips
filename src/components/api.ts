export async function getArtiklPoSifri(text: string, fetch: any) {
	const urlSearchParams = new URLSearchParams({ sifra: text });
	const artiklID = await fetch('/api/artiklPoSifri?' + urlSearchParams.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((res) => res.json())
		.then((res) => res.artiklID);
	return artiklID;
}
