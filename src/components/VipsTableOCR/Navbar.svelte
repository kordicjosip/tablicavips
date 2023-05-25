<script>
	export let scale = 1;
	export let trenutnaStranica = 1;
	export let dataStranica = [];
	let scalePercent;
	$: scalePercent = Math.round(scale * 100);
</script>

<div class="w-full h-full bg-gray-600 flex justify-center items-center text-white text-lg font-semibold gap-20">
	<div class="flex items-center">
		<button
			on:click={() => (trenutnaStranica = Math.max(trenutnaStranica - 1, 0))}
			class="w-7 h-7 hover:bg-blue-300 rounded-xl m-1">&lt;</button
		>
		<div>{trenutnaStranica + 1}/{dataStranica.length}</div>
		<button
			on:click={() => (trenutnaStranica = Math.min(trenutnaStranica + 1, dataStranica.length - 1))}
			class="w-7 h-7 hover:bg-blue-300 rounded-xl m-1">&gt;</button
		>
	</div>

	<div class="flex items-center">
		<button on:click={() => (scale = Math.max(scale - 0.05, 0.01))} class="w-7 h-7 hover:bg-blue-300 rounded-xl m-1"
			>-</button
		>
		<div class="select-none">{scalePercent}%</div>
		<button on:click={() => (scale = Math.min(scale + 0.05, 2.5))} class="w-7 h-7 hover:bg-blue-300 rounded-xl m-1"
			>+</button
		>
	</div>
</div>
