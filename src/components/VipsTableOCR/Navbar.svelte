<script>
	export let scale = 1;
	export let trenutnaStranica = 1;
	export let dataStranica = [];
	let scalePercent;
	$: scalePercent = Math.round(scale * 100);
</script>

<div class="w-full bg-gray-600 flex justify-center text-white text-lg font-semibold flex-shrink-0">
	<div class="flex mr-10">
		<button
			on:click={() => (trenutnaStranica = trenutnaStranica - 1)}
			class="w-7 h-7 hover:bg-blue-300 rounded-xl m-1">&lt;</button
		>
		<div class="my-auto">{trenutnaStranica + 1}/{dataStranica.length}</div>
		<button
			on:click={() => (trenutnaStranica = trenutnaStranica + 1)}
			class="w-7 h-7 hover:bg-blue-300 rounded-xl m-1">&gt;</button
		>
	</div>

	<div class="flex ml-10">
		<button on:click={() => (scale = scale - 0.05)} class="w-7 h-7 hover:bg-blue-300 rounded-xl m-1"
			>-</button
		>
		<div class="my-auto select-none">{scalePercent}%</div>
		<button on:click={() => (scale = scale + 0.05)} class="w-7 h-7 hover:bg-blue-300 rounded-xl m-1"
			>+</button
		>
	</div>
</div>
