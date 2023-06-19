<script lang="ts">
	import FileInput from '../components/Homepage/FileInput.svelte';
	import DocumentSelect from '../components/Homepage/DocumentSelect.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let form: HTMLFormElement;
	let documents;
	const onDrop = () => {
		form.requestSubmit();
	};
</script>

<div class="bg-white flex flex-col justify-center items-center text-center min-h-screen">
	<form
		action="http://192.168.10.20:8000/api/doc"
		method="POST"
		enctype="multipart/form-data"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			return async ({ result, update }) => {
				if (result.type === 'error') {
				}
				if (result.type === 'success') {
					await documents.getDocuments();
				}
				//TODO učitavanje dok se obradi dokument
				await applyAction(result);
				await goto(`/${result}`);
			};
		}}
		bind:this={form}
	>
		<FileInput {onDrop} />
	</form>

	<DocumentSelect bind:this={documents} />
</div>
