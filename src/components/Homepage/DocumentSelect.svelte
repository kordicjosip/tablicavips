<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import FileInput from './FileInput.svelte';
	import { applyAction, enhance } from '$app/forms';

	let documentsData = [];
	let listView = true;
	$: svgListColor = listView ? '#464feb' : '#424242';
	$: svgGridColor = listView ? '#424242' : '#464feb';

	let form: HTMLFormElement;
	let documents;
	const onDrop = () => {
		form.requestSubmit();
	};

	export async function getDocuments() {
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

<div class="flex gap-2 p-10">
	<button on:click={() => (listView = true)}>
		<svg
			width="25px"
			height="25px"
			viewBox="0 -5.5 21 21"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			fill="#000000"
			transform="matrix(-1, 0, 0, 1, 0, 0)"
			><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
				id="SVGRepo_tracerCarrier"
				stroke-linecap="round"
				stroke-linejoin="round"
			/><g id="SVGRepo_iconCarrier">
				<title>list</title> <desc>Created with Sketch.</desc> <defs />
				<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g
						id="Dribbble-Light-Preview"
						transform="translate(-59.000000, -285.000000)"
						fill={svgListColor}
					>
						<g id="icons" transform="translate(56.000000, 160.000000)">
							<path
								d="M3,135 L5.1,135 L5.1,133 L3,133 L3,135 Z M3,127.006 L5.1,127.006 L5.1,125.006 L3,125.006 L3,127.006 Z M3,131 L5.1,131 L5.1,129 L3,129 L3,131 Z M7.2,135 L24,135 L24,133 L7.2,133 L7.2,135 Z M7.2,127 L24,127 L24,125 L7.2,125 L7.2,127 Z M7.2,131 L24,131 L24,129 L7.2,129 L7.2,131 Z"
							/>
						</g>
					</g>
				</g>
			</g></svg
		>
	</button>
	<button on:click={() => (listView = false)}>
		<svg
			width="25px"
			height="25px"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			stroke={svgGridColor}
			><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
				id="SVGRepo_tracerCarrier"
				stroke-linecap="round"
				stroke-linejoin="round"
			/><g id="SVGRepo_iconCarrier">
				<rect x="4" y="4" width="7" height="7" rx="1" fill={svgGridColor} />
				<rect x="4" y="13" width="7" height="7" rx="1" fill={svgGridColor} />
				<rect x="13" y="4" width="7" height="7" rx="1" fill={svgGridColor} />
				<rect x="13" y="13" width="7" height="7" rx="1" fill={svgGridColor} />
			</g></svg
		>
	</button>
</div>
<div class="absolute right-52">
	<form
		action="http://192.168.10.20:8000/api/doc"
		method="POST"
		enctype="multipart/form-data"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			return async ({ result, update }) => {
				if (result.type === 'error') {
				}
				if (result.type === 'success') {
					await documents.getDocuments();
				}
				//TODO učitavanje dok se obradi dokument
				await applyAction(result);
				await goto(`/${result}`);
			};
		}}
		bind:this={form}
	>
		<FileInput {onDrop} />
	</form>
</div>
{#if documentsData.length > 0}
	{#if listView}
		<table class="w-fit">
			<tr>
				<th class="w-[50rem] mb-2 border-y border-neutral-300 py-2 text-start pl-5">
					Naziv dokumenta
				</th>
				<th class="w-fit mb-2 border-y border-neutral-300 py-2 text-end pr-9"> Datum </th>
			</tr>
			{#each documentsData as document}
				<tr
					class="hover:cursor-pointer hover:bg-neutral-100 rounded-xl"
					on:click={goto(`/${document.id}`)}
				>
					<td class="w-[50rem] mb-2 border-y border-neutral-300 py-2 text-start pl-5">
						{document.naziv}
					</td>
					<td class="w-fit mb-2 border-y border-neutral-300 py-2 text-end pr-5">
						{document.datum}
					</td>
				</tr>
			{/each}
		</table>
	{:else}
		<div class="grid grid-cols-4 gap-1 max-w-5xl">
			{#each documentsData as document}
				<div
					class="hover:cursor-pointer hover:bg-neutral-100 rounded-xl w-52 h-52 break-all shadow hover:shadow-md"
					on:click={goto(`/${document.id}`)}
				>
					<p class="mb-2 p-2">
						{document.naziv}
					</p>
					<p class="mb-2 py-2">
						{document.datum}
					</p>
				</div>
			{/each}
		</div>
	{/if}
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
