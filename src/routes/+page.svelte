<script lang="ts">
	import FileInput from '../components/Homepage/FileInput.svelte';
	import DocumentSelect from '../components/Homepage/DocumentSelect.svelte';
	import { enhance } from '$app/forms';

	let form: HTMLFormElement;
	const onDrop = () => {
		form.submit();
	};
</script>

<div class="bg-white flex flex-col justify-center items-center text-center min-h-screen">
	<form
		action="http://192.168.10.20:8000/api/doc"
		method="POST"
		enctype="multipart/form-data"
		use:enhance
		bind:this={form}
	>
		<FileInput {onDrop} />
	</form>

	<DocumentSelect />
</div>
