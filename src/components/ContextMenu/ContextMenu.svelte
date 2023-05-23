<script lang="ts">
	import { ContextMenuDefinition } from './index';
	import { onMount } from 'svelte';

	export let definition = new ContextMenuDefinition();
	export let x = 0;
	export let y = 0;
	export let visible = false;

	let ScrollPositionVertical = 0;
	let ScrollPositionHorizontal = 0;
	onMount(async () => {
		document.addEventListener('scroll', (event) => {
			ScrollPositionHorizontal = window.scrollX;
			ScrollPositionVertical = window.scrollY;
		});
	});
</script>

<div
	id="context-menu"
	class="bg-gray-200 text-white"
	class:invisible={visible === false}
	style="left: {x + ScrollPositionHorizontal + 1}px; top: {y + ScrollPositionVertical}px;"
>
	{#each definition.groups as group}
		<ul>
			{#each group.entries as entry}
				<li
					on:click={entry.action}
					class="bg-cyan-600 hover:bg-cyan-700 border-1 rounded m-1 px-2 py-0.5 cursor-pointer"
				>
					{entry.title}
				</li>
			{/each}
		</ul>
	{/each}
</div>

<style>
	#context-menu {
		position: absolute;
		width: auto;
		height: auto;
	}
	ul li {
		width: auto;
	}
</style>
