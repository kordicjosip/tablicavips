<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let documentsData = [];

	async function getDocuments() {
		const res = await fetch('http://192.168.10.20:8000/api/doc', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		documentsData = await res.json();
	}

	onMount(async () => {
		await getDocuments();
	});
</script>

<div class="flex flex-col items-center">
	<p class="my-5">ili izaberite dokument:</p>

	{#each documentsData as document}
		<div
			on:click={goto(`/${document.id}`)}
			class="w-80 py-0.5 border border-neutral-500 rounded mb-2 hover:cursor-pointer hover:bg-neutral-300"
		>
			{document.id}
		</div>
	{/each}
</div>
