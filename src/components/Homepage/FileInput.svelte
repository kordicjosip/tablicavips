<script lang="ts">
	import FallbackSvg from './FallbackSvg.svelte';

	export let multiple: boolean = false;
	export let disabled: boolean = false;
	export let onDrop: () => void;
	export let onEnter: () => void = () => {};
	export let onLeave: () => void = () => {};
	export let value;

	let isOver: boolean = false;
	let input: HTMLInputElement;

	const handleEnter = () => {
		isOver = true;
		if (onEnter) {
			onEnter();
		}
	};

	const handleLeave = () => {
		isOver = false;
		if (onLeave) {
			onLeave();
		}
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();

		if (!e?.dataTransfer?.items || disabled) {
			return;
		}
		onDrop();
		isOver = false;
	};

	const handleDragOver = (e: Event) => {
		e.preventDefault();
	};

	const handleChange = (e: Event) => {
		e.preventDefault();
		onDrop();
	};

	const onClick = () => {
		input.click();
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			input.click();
		}
	};
</script>

<div
	class="w-40 h-20 cursor-pointer m-3"
	on:drop={handleDrop}
	on:dragover={handleDragOver}
	on:dragenter={handleEnter}
	on:dragleave={handleLeave}
	on:click={onClick}
	on:keydown={onKeyDown}
	tabIndex={0}
>
	<div id="fallback" class="flex rounded-xl w-40 h-20 border border-dashed border-black m-auto">
		<FallbackSvg over={isOver} />
	</div>
</div>
<input
	class="hidden"
	type="file"
	accept=".pdf"
	name="file"
	on:change={handleChange}
	bind:this={input}
	bind:value
	{multiple}
	{disabled}
/>
