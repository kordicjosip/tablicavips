<script lang="ts">
	import type { TableData } from './index';

	export let data: TableData[];
	export let trenutnaStranica = 0;
</script>

<div class="bg-siva grid gap-1 p-1">
	{#each data as stranica, i}
		<button
			on:click={() => (trenutnaStranica = i)}
			class:brightness-75={trenutnaStranica !== i}
			class:border-blue-400={trenutnaStranica === i}
			class:brightness-100={trenutnaStranica === i}
			class="bg-white border-4 hover:border-2 hover:border-blue-400 text-black text-xl"
		>
			<img src={stranica.image} alt="Page {i + 1}" />
			{i + 1}
		</button>
	{/each}
</div>

<style>
</style>
