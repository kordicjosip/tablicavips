<script lang="ts">
	export let image: string;
	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;
</script>

<svg
	class="fixed bottom-8 right-8 max-w-[12rem] max-h-20 float-right border-2 border-emerald-600"
	viewBox="{x} {y} {width} {height}">
	<image href={image} />
</svg>

<style>
</style>
