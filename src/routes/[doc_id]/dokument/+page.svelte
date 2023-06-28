<script lang="ts">
	import { onMount } from 'svelte';

	export let data;
	let cells;

	onMount(() => {
		cells = localStorage.getItem(data.id);
		console.log(cells);
	});
</script>

<h1>{cells}</h1>
