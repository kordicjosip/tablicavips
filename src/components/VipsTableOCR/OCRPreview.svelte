<script lang="ts">
	export let image: string;
	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;
</script>

<svg class="sticky top-[45%] max-h-14" viewBox="{x} {y} {width} {height}">
	<image href={image} />
</svg>

<style>
</style>
