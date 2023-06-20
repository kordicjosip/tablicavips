<script lang="ts">
	export let multiple: boolean = false;
	export let disabled: boolean = false;
	export let onDrop: (e: Event) => void;

	let input: HTMLInputElement;

	const handleDrop = (e: Event) => {
		e.preventDefault();
		onDrop(e);
	};
</script>

<input
	class="w-52 h-fit cursor-pointer m-3"
	type="file"
	accept=".pdf"
	name="file"
	on:change={handleDrop}
	bind:this={input}
	{multiple}
	{disabled}
/>
