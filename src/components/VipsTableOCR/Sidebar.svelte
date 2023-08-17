<script lang="ts">
	import type { TableData } from './index';

	export let data: TableData[];
	export let currentPage = 0;
</script>

<div class="bg-siva grid gap-1 p-1">
	{#each data as stranica, i}
		<button
			on:click={() => (currentPage = i)}
			class:brightness-75={currentPage !== i}
			class:border-blue-400={currentPage === i}
			class:brightness-100={currentPage === i}
			class:hover:brightness-90={currentPage !== i}
			class="bg-white border-4 text-black text-xl">
			<img src="http://192.168.10.20:8000/slika-tablice/{stranica.id}" alt="Page {i + 1}" />
			{i + 1}
		</button>
	{/each}
</div>

<style>
</style>
