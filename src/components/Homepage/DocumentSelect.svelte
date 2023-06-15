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

	{#if documentsData.length > 0}
		{#each documentsData as document}
			<div
				on:click={goto(`/${document.id}`)}
				class="w-80 py-0.5 border border-neutral-500 rounded mb-2 hover:cursor-pointer hover:bg-neutral-300"
			>
				{document.id}
			</div>
		{/each}
	{:else}
		<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
				opacity=".25"
			/>
			<path
				d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
				class="loading"
			/>
		</svg>
	{/if}
</div>

<style>
	.loading {
		transform-origin: center;
		animation: animation 0.75s infinite linear;
	}

	@keyframes animation {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
