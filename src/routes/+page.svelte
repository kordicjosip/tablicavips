<script lang="ts">
	import FileInput from '../components/Homepage/FileInput.svelte';
	import { goto } from '$app/navigation';

	const onDrop = (files: File[]) => {
		alert(`Odabrana datoteka: ${files.map((d) => d.name).join(', ')}`);
		goto('/app');
	};
</script>

<div class="bg-white">
	<FileInput {onDrop} />
</div>
