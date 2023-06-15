<script lang="ts">
	import { VipsTableOCR } from '../../components/VipsTableOCR';

	export let data;
</script>

<div class="bg-white h-screen">
	<VipsTableOCR dokumentData={data.dokumentData} />
</div>
