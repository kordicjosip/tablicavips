<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { type TableColumnInterface } from './index';

	const dispatch = new createEventDispatcher();
	let dialog;
	let regexString: string;
	export let column: TableColumnInterface;
	let columnID: number;

	export function show(columnId: number) {
		columnID = columnId;
		dialog.showModal();
	}

	function save() {
		dispatch('setColumnRegexString', {
			id: columnID,
			regexString: regexString
		});
		console.log(column);
		closeModal();
	}

	const closeModal = () => {
		dialog.close();
	};
</script>

<dialog bind:this={dialog} class="bg-neutral-700 text-center w-fit rounded">
	<div id="dialogdiv" class="flex flex-col">
		<label class="text-white" for="name">Upiši RegExp za ovaj stupac:</label>
		<input
			type="text"
			id="name"
			name="name"
			required
			class="px-1 mt-1 rounded"
			minlength="1"
			bind:value={regexString}
		/>
		<br />
		<div class="flex justify-between w-full">
			<button class="h-8 text-white px-2 py-0.5 items-center" on:click={closeModal}>Odustani</button
			>
			<button
				class="rounded-[0.2rem] h-8 font-medium text-white outline outline-1 px-2 py-0.5 items-center hover:bg-neutral-600"
				on:click={save}>Spremi</button
			>
		</div>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
</style>
