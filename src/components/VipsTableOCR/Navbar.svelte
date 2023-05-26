<script>
	export let scale = 1;
	export let trenutnaStranica = 1;
	export let dataStranica = [];
	let scalePercent;
	$: scalePercent = Math.round(scale * 100);

	let offsetStupcaLijevo = 0;
	let offsetStupcaDesno = 0;
	let offsetStupaca = 0;

	$: {
		if (dataStranica[trenutnaStranica]) {
			offsetStupcaLijevo = Math.min(
				...dataStranica[trenutnaStranica].columns.map((stupac) => stupac.x1)
			);
			offsetStupcaDesno =
				dataStranica[trenutnaStranica].resolution[0] -
				Math.max(...dataStranica[trenutnaStranica].columns.map((stupac) => stupac.x2));
		}
	}

	function offsetStupce() {
		dataStranica[trenutnaStranica].columns.forEach((stupac) => (stupac.x1 += offsetStupaca));
		dataStranica[trenutnaStranica].columns.forEach((stupac) => (stupac.x2 += offsetStupaca));
		dataStranica[trenutnaStranica] = dataStranica[trenutnaStranica];
	}
</script>

<div
	class="w-full h-full bg-neutral-700 flex justify-center items-center text-white text-lg font-semibold gap-20"
>
	<div class="flex items-center">
		<button
			class="w-7 h-7 hover:bg-neutral-600 rounded-full m-1"
			on:click={() => (trenutnaStranica = Math.max(trenutnaStranica - 1, 0))}
			>&lt;
		</button>
		<div>{trenutnaStranica + 1}/{dataStranica.length}</div>
		<button
			class="w-7 h-7 hover:bg-neutral-600 rounded-full m-1"
			on:click={() => (trenutnaStranica = Math.min(trenutnaStranica + 1, dataStranica.length - 1))}
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

	<input
		bind:value={offsetStupaca}
		max={offsetStupcaDesno}
		min={-offsetStupcaLijevo}
		on:input={offsetStupce}
		type="range"
	/>
</div>
