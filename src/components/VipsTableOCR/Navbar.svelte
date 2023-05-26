<script lang="ts">
	export let scale: number;
	export let brojStranica: number | null;
	export let trenutnaStranica: number | null;

	$: scalePercent = Math.round(scale * 100);
</script>

<div
	class="w-full h-full bg-neutral-700 flex justify-center items-center text-white text-lg font-semibold gap-20"
>
	{#if brojStranica > 0}
		<div class="flex items-center">
			<button
				class="w-7 h-7 hover:bg-neutral-600 rounded-full m-1"
				on:click={() => (trenutnaStranica = Math.max(trenutnaStranica - 1, 0))}
				>&lt;
			</button>
			<div>{trenutnaStranica + 1}/{brojStranica}</div>
			<button
				class="w-7 h-7 hover:bg-neutral-600 rounded-full m-1"
				on:click={() => (trenutnaStranica = Math.min(trenutnaStranica + 1, brojStranica - 1))}
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
