<script lang="ts">
	import FileInput from '../components/Homepage/FileInput.svelte';
	import DocumentSelect from '../components/Homepage/DocumentSelect.svelte';

	const onDrop = (files: File[]) => {
		alert(`Odabrana datoteka: ${files.map((d) => d.name).join(', ')}`);
	};
</script>

<div class="bg-white flex flex-col justify-center items-center text-center min-h-screen">
	<FileInput {onDrop} />
	<DocumentSelect />
</div>
