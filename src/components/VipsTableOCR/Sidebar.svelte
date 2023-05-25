<script>
	export let dataStranica = [];
	export let trenutnaStranica = 0;
</script>

<div class="bg-siva h-screen w-36 border-r border-gray-500">
	{#each dataStranica as stranica, i}
		<button
			on:click={() => (trenutnaStranica = i)}
			class="flex flex-col mb-2 mx-2 bg-white bottom-5 border border-gray-500 text-black text-xl cursor-pointer select-none"
		>
			<div>
				<img src={dataStranica[i].image} />
				<h1>{i + 1}</h1>
			</div>
		</button>
	{/each}
</div>

<style>
</style>
