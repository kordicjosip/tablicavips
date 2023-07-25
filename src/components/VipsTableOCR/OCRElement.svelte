<script lang="ts">
	import type { OCR } from './index';

	export let ocr: OCR;
	export let offsetX: number;
	export let offsetY: number;
	export let selected: boolean;
</script>

<g transform="translate({ocr.x1 - offsetX} {ocr.y1 - offsetY})">
	{#if selected}
		<rect width={ocr.x2 - ocr.x1} height={ocr.y2 - ocr.y1 + 2} fill="rgba(0,150,0,90%)" />
	{:else}
		<rect width={ocr.x2 - ocr.x1} height={ocr.y2 - ocr.y1 + 2} fill="rgba(255,0,0,85%)" />
	{/if}
	<text
		class="fill-white"
		dominant-baseline="central"
		font-size="10pt"
		text-anchor="middle"
		x={(ocr.x2 - ocr.x1) / 2}
		y={(ocr.y2 - ocr.y1) / 2}>{ocr.text}</text
	>
</g>
