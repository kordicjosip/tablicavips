<script>
	import { onMount } from 'svelte';

	let documentsData = [];
	let odabraniDokumentID = '';

	async function getDocuments() {
		const res = await fetch('http://192.168.10.20:8000/api/doc', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		documentsData = await res.json();
	}

	async function getDocumentData() {
		const url = `http://192.168.10.20:8000/api/doc/${odabraniDokumentID}`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await res.json();
		console.log(data);
	}

	onMount(async () => {
		await getDocuments();
	});
</script>

<div class="flex flex-col items-center">
	<label for="dokumenti" class="my-5">ili</label>
	<select
		id="dokumenti"
		class="w-fit text-center h-6 rounded border border-black"
		bind:value={odabraniDokumentID}
		on:change={getDocumentData}
	>
		<option disabled selected value>izaberite dokument</option>
		{#each documentsData as document}
			<option value={document.id}>
				{document.id}
			</option>
		{/each}
	</select>
</div>
