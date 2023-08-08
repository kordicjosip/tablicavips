<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import FileInput from './FileInput.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { povezaniDokumenti } from '$components/store';

	export let data;

	let documentsData = [];
	let listView = true;

	$: svgListColor = listView ? '#464feb' : '#424242';
	$: svgGridColor = listView ? '#424242' : '#464feb';

	function removeRow(id) {
		let indexToRemove = $povezaniDokumenti?.findIndex((doc) => doc.id === id);
		if ($povezaniDokumenti) {
			if (indexToRemove != null) {
				$povezaniDokumenti.splice(indexToRemove, 1);
				povezaniDokumenti.set($povezaniDokumenti);
			}
		}
	}

	let form: HTMLFormElement;
	$: documentsData = data.documents;
	const onDrop = (event) => {
		form.requestSubmit();
	};

	async function drop(event: DragEvent) {
		dragoverDropCount = 0;
		for (const file of event.dataTransfer.files) {
			const formData = new FormData();
			formData.append('file', file);
			await submitUploadFileFormData(formData);
		}
	}

	async function uploadFile(event: SubmitEvent) {
		const formData = new FormData(event.target as HTMLFormElement);
		await submitUploadFileFormData(formData);
	}

	async function submitUploadFileFormData(formData: FormData) {
		const res = await fetch('http://192.168.10.20:8000/api/doc', {
			body: formData,
			method: 'POST'
		}).then((res) => res.json());
		await invalidate('http://192.168.10.20:8000/api/doc');
	}

	let interval;
	onMount(async () => {
		interval = setInterval(async () => {
			await invalidate('http://192.168.10.20:8000/api/doc');
		}, 5000);
	});
	onDestroy(async () => {
		clearInterval(interval);
	});

	let dragoverDropCount = 0;
</script>

<div
	on:dragenter={() => {
		dragoverDropCount++;
	}}
	on:dragleave={() => {
		dragoverDropCount--;
	}}
	on:dragover|preventDefault
	on:drop|preventDefault={drop}
>
	<div
		class="z-50 absolute top-0 left-0 h-full w-full bg-cyan-800/90 outline-white outline-dashed outline-8 -outline-offset-[20px] flex flex-col items-center justify-center"
		class:hidden={dragoverDropCount === 0}
		id="dropzone"
	>
		<svg
			fill="#ffffff"
			height="200px"
			stroke="#ffffff"
			viewBox="0 0 24 24"
			width="200px"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="SVGRepo_bgCarrier" stroke-width="0" />
			<g
				id="SVGRepo_tracerCarrier"
				stroke="#CCCCCC"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="0.9600000000000002"
			/>
			<g id="SVGRepo_iconCarrier">
				<title />
				<g id="Complete">
					<g id="upload">
						<g>
							<path
								d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
								fill="none"
								stroke="#ffffff"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.8"
							/>
							<g>
								<polyline
									data-name="Right"
									fill="none"
									id="Right-2"
									points="7.9 6.7 12 2.7 16.1 6.7"
									stroke="#ffffff"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.8"
								/>
								<line
									fill="none"
									stroke="#ffffff"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.8"
									x1="12"
									x2="12"
									y1="16.3"
									y2="4.8"
								/>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
		<h1 class="text-white text-4xl">Drop files here!</h1>
	</div>

	<div class="flex justify-center gap-2 p-4 mb-6">
		<button on:click={() => (listView = true)}>
			<svg
				fill="#000000"
				height="25px"
				transform="matrix(-1, 0, 0, 1, 0, 0)"
				viewBox="0 -5.5 21 21"
				width="25px"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g id="SVGRepo_bgCarrier" stroke-width="0" />
				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
				<g id="SVGRepo_iconCarrier">
					<title>list</title>
					<desc>Created with Sketch.</desc>
					<defs />
					<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
						<g
							fill={svgListColor}
							id="Dribbble-Light-Preview"
							transform="translate(-59.000000, -285.000000)"
						>
							<g id="icons" transform="translate(56.000000, 160.000000)">
								<path
									d="M3,135 L5.1,135 L5.1,133 L3,133 L3,135 Z M3,127.006 L5.1,127.006 L5.1,125.006 L3,125.006 L3,127.006 Z M3,131 L5.1,131 L5.1,129 L3,129 L3,131 Z M7.2,135 L24,135 L24,133 L7.2,133 L7.2,135 Z M7.2,127 L24,127 L24,125 L7.2,125 L7.2,127 Z M7.2,131 L24,131 L24,129 L7.2,129 L7.2,131 Z"
								/>
							</g>
						</g>
					</g>
				</g>
			</svg>
		</button>
		<button on:click={() => (listView = false)}>
			<svg
				fill="none"
				height="25px"
				stroke={svgGridColor}
				viewBox="0 0 24 24"
				width="25px"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g id="SVGRepo_bgCarrier" stroke-width="0" />
				<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
				<g id="SVGRepo_iconCarrier">
					<rect fill={svgGridColor} height="7" rx="1" width="7" x="4" y="4" />
					<rect fill={svgGridColor} height="7" rx="1" width="7" x="4" y="13" />
					<rect fill={svgGridColor} height="7" rx="1" width="7" x="13" y="4" />
					<rect fill={svgGridColor} height="7" rx="1" width="7" x="13" y="13" />
				</g>
			</svg>
		</button>
	</div>
	<form
		action="http://192.168.10.20:8000/api/doc"
		bind:this={form}
		class="absolute right-10 top-0"
		enctype="multipart/form-data"
		method="POST"
		on:submit|preventDefault={uploadFile}
	>
		<FileInput {onDrop} />
	</form>
	{#if documentsData.length > 0}
		{#if listView}
			<table class="w-fit">
				<tr>
					<th class="w-[50rem] mb-2 border-b border-neutral-300 py-2 text-start pl-5 select-none">
						Naziv dokumenta
					</th>
					<th class="w-fit mb-2 border-b border-neutral-300 py-2 text-end pr-9 select-none">
						Datum
					</th>
				</tr>
				{#each $povezaniDokumenti || [] as dokument}
					<tr class="hover:cursor-pointer bg-[#e6f1ff] hover:bg-blue-100 rounded-xl">
						<td
							class="w-[50rem] mb-2 border-y border-neutral-300 py-2 text-start pl-5"
							on:click={goto(`/${dokument.id}/stupci`)}
						>
							{dokument.naziv}
						</td>
						<td
							class="w-fit mb-2 border-y border-neutral-300 py-2 text-end pr-5"
							on:click={goto(`/${dokument.id}/stupci`)}
						>
							{new Date(dokument.datum).getUTCDate()}.{new Date(
								dokument.datum
							).getUTCMonth()}.{new Date(dokument.datum).getUTCFullYear()}
						</td>
						<td
							title="Ukloni dokument"
							class="bg-white h-full px-1 group"
							on:click={() => removeRow(dokument.id)}
						>
							<svg
								class="group-hover:stroke-blue-500"
								stroke="black"
								width="25px"
								height="25px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<g id="Interface / Check_All_Big">
										<path
											id="Vector"
											d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</g>
								</g></svg
							>
						</td>
					</tr>
				{/each}
				{#each documentsData as document}
					{#if document.obrada_u_toku}
						<tr class="rounded-xl hover:cursor-wait">
							<td class="w-[50rem] mb-2 border-y border-neutral-300 py-2 text-start pl-5">
								Dokument se obrađuje...
							</td>
							<td class="w-fit mb-2 border-y border-neutral-300 py-2 text-end pr-5">
								<span class="flex justify-center">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
											opacity=".25"
										/>
										<path
											d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
											class="loading"
										/>
									</svg>
								</span>
							</td>
						</tr>
					{:else}
						<tr
							class="hover:cursor-pointer hover:bg-neutral-100 rounded-xl"
							on:click={goto(`/${document.id}/stupci`)}
						>
							<td class="w-[50rem] mb-2 border-y border-neutral-300 py-2 text-start pl-5">
								{document.naziv}
							</td>
							<td class="w-fit mb-2 border-y border-neutral-300 py-2 text-end pr-5">
								{new Date(document.datum).getUTCDate()}.{new Date(
									document.datum
								).getUTCMonth()}.{new Date(document.datum).getUTCFullYear()}
							</td>
						</tr>
					{/if}
				{/each}
			</table>
		{:else}
			<div class="grid grid-cols-4 gap-2 max-w-5xl">
				{#each $povezaniDokumenti || [] as dokument}
					<div
						class="flex flex-col relative justify-between w-52 h-52 hover:cursor-pointer bg-blue-100 hover:bg-blue-200 rounded-md shadow hover:shadow-md"
						on:click={goto(`/${dokument.id}/stupci`)}
					>
						<img
							src={dokument.thumbnail}
							class="h-40 object-cover object-top rounded-t-md"
							alt="pregled dokumenta"
						/>
						<button
							class="group absolute top-2 right-2 outline-1 outline-black hover:outline-blue-500 outline backdrop-blur-md backdrop-brightness-110 rounded-md"
							title="Ukloni dokument"
							on:click={() => removeRow(dokument.id)}
							><svg
								class="group-hover:stroke-blue-500 m-0.5"
								stroke="black"
								width="30px"
								height="30px"
								viewBox="0 -1 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<g id="Interface / Check_All_Big">
										<path
											id="Vector"
											d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</g>
								</g></svg
							></button
						>
						<div class="">
							<h1 class="truncate px-1" title={dokument.naziv}>
								{dokument.naziv}
							</h1>
							<h2 class="">
								{dokument.datum}
							</h2>
						</div>
					</div>
				{/each}
				{#each documentsData as document}
					{#if document.obrada_u_toku}
						<div
							class="hover:cursor-wait flex flex-col justify-between w-52 h-52 rounded-md shadow hover:shadow-md"
						>
							<svg
								class="mx-auto mt-[4.2rem]"
								width="40"
								height="40"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
									opacity=".25"
								/>
								<path
									d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
									class="loading"
								/>
							</svg>
							<div class="">
								<h1 class="truncate p-3">Dokument se obrađuje...</h1>
							</div>
						</div>
					{:else}
						<div
							class="flex flex-col justify-between w-52 h-52 hover:cursor-pointer hover:bg-neutral-100 rounded-md shadow hover:shadow-md"
							on:click={goto(`/${document.id}/stupci`)}
						>
							<img
								src={document.thumbnail}
								class="h-40 object-cover object-top"
								alt="pregled dokumenta"
							/>
							<div class="">
								<h1 class="truncate px-1" title={document.naziv}>
									{document.naziv}
								</h1>
								<h2 class="">
									{document.datum}
								</h2>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	{:else}
		<div class="flex justify-center mt-20">
			<svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
					opacity=".25"
				/>
				<path
					d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
					class="loading"
				/>
			</svg>
		</div>
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
