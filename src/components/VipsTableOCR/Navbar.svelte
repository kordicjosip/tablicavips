<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let scale: number;
	export let numberOfPages: number | null;
	export let currentPage: number | null;
	export let isUnlinked: boolean;

	$: scalePercent = Math.round(scale * 100);
</script>

<div
	class="w-full h-full bg-neutral-700 flex justify-center items-center text-white text-lg font-semibold gap-20"
>
	{#if numberOfPages > 0}
		<div>
			<input
				type="checkbox"
				id="uredi stranicu"
				bind:checked={isUnlinked}
				on:change={() => dispatch('toggleUnlink', isUnlinked)}
				name="zaključaj"
			/>
			<label for="uredi stranicu" class="text-base">Otkači ovu stranicu</label>
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
				class="w-7 h-7 hover:bg-neutral-600 rounded-xl m-1"
				on:click={() => (scale = Math.max(scale - 0.05, 0.01))}
				>-
			</button>
			<div class="select-none">{scalePercent}%</div>
			<button
				class="w-7 h-7 hover:bg-neutral-600 rounded-xl m-1"
				on:click={() => (scale = Math.min(scale + 0.05, 2.5))}
				>+
			</button>
		</div>
	{/if}
</div>
