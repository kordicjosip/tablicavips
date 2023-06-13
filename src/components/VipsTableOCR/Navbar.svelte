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

	function getColumnTemplates() {
		dispatch('getColumnTemplates');
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
				title="Predlošci stupaca"
				class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-neutral-600 hover:cursor-pointer"
				on:click={dialog.show}
			>
				<svg
					width="80px"
					height="80px"
					viewBox="-6.24 -6.24 36.48 36.48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					/><g id="SVGRepo_iconCarrier">
						<path
							d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z"
							stroke="#ffffff"
							stroke-width="1.7759999999999998"
						/> <path d="M3 16.5H21" stroke="#ffffff" stroke-width="1.7759999999999998" />
						<path d="M3 12H21" stroke="#ffffff" stroke-width="1.7759999999999998" />
						<path d="M21 7.5H3" stroke="#ffffff" stroke-width="1.7759999999999998" />
						<path d="M12 21V3" stroke="#ffffff" stroke-width="1.7759999999999998" />
					</g></svg
				>
			</div>
		</div>
	{/if}
</div>

<Dialog
	bind:columnTemplatesData
	bind:selectedColumnTemplate
	bind:this={dialog}
	on:postColumnTemplate={postColumnTemplate}
	on:getColumnTemplates={getColumnTemplates}
	on:changeColumnTemplate={changeColumnTemplate}
/>
