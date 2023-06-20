<script lang="ts">
	import DocumentSelect from '../components/Homepage/DocumentSelect.svelte';

	export let data;
</script>

<div class="bg-white flex flex-col items-center text-center min-h-screen">
	<DocumentSelect bind:data />
</div>
