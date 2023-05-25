<script>
	export let dataStranica = [];
	export let trenutnaStranica = 0;
</script>

<div class="bg-siva py-2 w-40 overflow-y-scroll">
	{#each dataStranica as stranica, i}
		<button
			on:click={() => (trenutnaStranica = i)}
			class:brightness-75={trenutnaStranica !== i}
			class:border-blue-400={trenutnaStranica === i}
			class:brightness-100={trenutnaStranica === i}
			class="flex flex-col mb-2 mx-2 bg-white bottom-5 border-4 hover:border-2 hover:border-blue-400 text-black text-xl cursor-pointer select-none"
		>
			<span class="">
				<img src={dataStranica[i].image} />
				<h1>{i + 1}</h1>
			</span>
		</button>
	{/each}
</div>

<style>
</style>
