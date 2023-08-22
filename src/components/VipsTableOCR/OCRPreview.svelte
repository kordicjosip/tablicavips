<script lang="ts">
	import { env } from '$env/dynamic/public';
	export let tablicaId: string;
	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;
</script>

<svg
	class="fixed bottom-8 right-8 max-w-[12rem] max-h-20 float-right border-2 border-emerald-600"
	viewBox="{x} {y} {width} {height}">
	<image href="{env.PUBLIC_API_URL}/slika-tablice/{tablicaId}" />
</svg>

<style>
</style>
