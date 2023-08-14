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
	accept=".pdf"
	bind:this={input}
	class="w-60 h-fit file:cursor-pointer m-3
		file:mr-4 file:py-2 file:px-4
    	file:rounded-full file:border-0
    	file:text-sm file:font-semibold
    	file:bg-blue-50 file:text-blue-700
    	hover:file:bg-blue-100"
	{disabled}
	{multiple}
	name="file"
	on:change={handleDrop}
	type="file" />
