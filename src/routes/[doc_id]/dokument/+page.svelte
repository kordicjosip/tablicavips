<script lang="ts">
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		const cells = localStorage.getItem(data.id);
		console.log(cells);
	});
</script>
