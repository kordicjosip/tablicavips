<script lang="ts">
	import FallbackSvg from './FallbackSvg.svelte';

	export let multiple: boolean = false;
	export let disabled: boolean = false;
	export let onDrop: (files: File[]) => void;
	export let onEnter: () => void = () => {};
	export let onLeave: () => void = () => {};

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
		const items = Array.from(e.dataTransfer.files);
		onDrop(items);
		isOver = false;
	};

	const handleDragOver = (e: Event) => {
		e.preventDefault();
	};

	const handleChange = (e: Event) => {
		e.preventDefault();
		const files: FileList = <FileList>(<HTMLInputElement>e.target).files;
		onDrop(Array.from(files));
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
	class="w-[42rem] h-full m-auto cursor-pointer"
	on:drop={handleDrop}
	on:dragover={handleDragOver}
	on:dragenter={handleEnter}
	on:dragleave={handleLeave}
	on:click={onClick}
	on:keydown={onKeyDown}
	tabIndex={0}
>
	<div
		id="fallback"
		class="flex items-center w-full h-[15rem] rounded-xl border border-dashed border-black m-auto max-w-full max-h-full"
	>
		<FallbackSvg over={isOver} />
	</div>
</div>
<input
	class="hidden"
	type="file"
	on:change={handleChange}
	bind:this={input}
	{multiple}
	{disabled}
/>
