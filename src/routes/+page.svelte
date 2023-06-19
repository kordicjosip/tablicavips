<script lang="ts">
	import DocumentSelect from '../components/Homepage/DocumentSelect.svelte';

	let documents;
</script>

<div class="bg-white flex flex-col items-center text-center min-h-screen">
	<DocumentSelect bind:this={documents} />
</div>
