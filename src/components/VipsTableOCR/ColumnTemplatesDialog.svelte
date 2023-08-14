<script lang="ts" xmlns="http://www.w3.org/1999/html">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let dialog;
	let columnTemplateName;
	export let columnTemplatesData: [];
	export let selectedColumnTemplate;

	export function show() {
		dialog.showModal();
	}

	function save() {
		dispatch('postColumnTemplate', columnTemplateName);
		dispatch('getColumnTemplates');
		closeModal();
	}

	function changeColumnTemplate() {
		dispatch('changeColumnTemplate', selectedColumnTemplate['definicija']['stupci']);
	}

	const closeModal = () => {
		dialog.close();
	};
</script>

<dialog bind:this={dialog} class="bg-neutral-700 w-fit rounded">
	<div id="dialogdiv" class="flex flex-col">
		<label class="text-white" for="predlozak">Izaberi predložak stupaca:</label>
		<select
			id="predlozak"
			class="text-black text-base h-6 rounded mt-1 mb-3"
			bind:value={selectedColumnTemplate}
			on:change={changeColumnTemplate}
			on:change={closeModal}>
			{#each columnTemplatesData as columnTemplate}
				<option value={columnTemplate}>
					{columnTemplate.naziv}
				</option>
			{/each}
		</select>
		<label class="text-white" for="name">Dodaj novi predložak:</label>
		<input
			type="text"
			placeholder="Naziv predloška"
			id="name"
			name="name"
			required
			class="px-1 mt-1 rounded"
			minlength="1"
			bind:value={columnTemplateName} />
		<br />
		<div class="flex justify-between w-full">
			<button class="h-8 text-white px-2 py-0.5 items-center" on:click={closeModal}
				>Odustani</button>
			<button
				class="rounded-[0.2rem] hover:bg-neutral-600 h-8 font-medium text-white outline outline-1 px-2 py-0.5 items-center"
				on:click={save}>Spremi</button>
		</div>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
</style>
