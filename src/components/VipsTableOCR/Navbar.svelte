<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Dialog from './Dialog.svelte';

	let dialog;
	const dispatch = createEventDispatcher();
	export let scale: number;
	export let numberOfPages: number | null;
	export let currentPage: number | null;
	export let isUnlinked: boolean;
	export let columnTemplatesData: [];
	let selectedColumnTemplate;

	function postColumnTemplate(event) {
		dispatch('postColumnTemplate', event.detail);
	}

	$: scalePercent = Math.round(scale * 100);
	function changeColumnTemplate() {
		dispatch('changeColumnTemplate', selectedColumnTemplate['definicija']['stupci']);
	}
</script>

<div
	class="w-full h-full bg-neutral-700 flex justify-center items-center text-white text-lg font-semibold gap-20"
>
	{#if numberOfPages > 0}
		<div>
			<input
				class={isUnlinked ? 'cursor-default' : 'cursor-pointer'}
				type="checkbox"
				id="otkači stranicu"
				bind:checked={isUnlinked}
				on:change={() => dispatch('toggleUnlink', isUnlinked)}
				name="zaključaj"
			/>
			<label for="otkači stranicu" class="text-base">Otkači ovu stranicu</label>
		</div>
		<div class="flex items-center">
			<button
				class="w-7 h-7 hover:bg-neutral-600 rounded-full m-1"
				on:click={() => (currentPage = Math.max(currentPage - 1, 0))}
				>&lt;
			</button>
			<div>{currentPage + 1}/{numberOfPages}</div>
			<button
				class="w-7 h-7 hover:bg-neutral-600 rounded-full m-1"
				on:click={() => (currentPage = Math.min(currentPage + 1, numberOfPages - 1))}
				>&gt;
			</button>
		</div>

		<div class="flex items-center">
			<button
				class="w-7 h-7 hover:bg-neutral-600 rounded-full m-1"
				on:click={() => (scale = Math.max(scale - 0.05, 0.01))}
				>-
			</button>
			<div class="select-none">{scalePercent}%</div>
			<button
				class="w-7 h-7 hover:bg-neutral-600 rounded-full m-1"
				on:click={() => (scale = Math.min(scale + 0.05, 2.5))}
				>+
			</button>
		</div>

		<div class="flex items-center">
			<div
				title="Spremi stupce kao predložak"
				class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-neutral-600 hover:cursor-pointer"
				on:click={dialog.show}
			>
				<svg viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g clip-path="url(#clip0_429_11181)">
						<path
							d="M7 21C5.89543 21 5 20.1046 5 19V3H14L19 8V19C19 20.1046 18.1046 21 17 21H7Z"
							stroke="white"
							stroke-width="1.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M12 13V17"
							stroke="white"
							stroke-width="1.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M10 15H14"
							stroke="white"
							stroke-width="1.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path d="M13 3V9H19" stroke="white" stroke-width="1.2" stroke-linejoin="round" />
					</g>
				</svg>
			</div>
			<select
				class="text-black text-base h-6 rounded ml-1"
				bind:value={selectedColumnTemplate}
				on:change={changeColumnTemplate}
			>
				<option value="">trenutna</option>
				{#each columnTemplatesData as columnTemplate}
					<option value={columnTemplate}>
						{columnTemplate.naziv}
					</option>
				{/each}
			</select>
		</div>
	{/if}
</div>

<Dialog bind:this={dialog} on:postColumnTemplate={postColumnTemplate} />
