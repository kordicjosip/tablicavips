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
		document.addEventListener('scroll', () => {
			ScrollPositionHorizontal = window.scrollX;
			ScrollPositionVertical = window.scrollY;
		});
	});
</script>

<div
	id="context-menu"
	class="absolute bg-neutral-700 border border-gray-400 text-white h-auto w-auto"
	class:invisible={visible === false}
	style="left: {x + ScrollPositionHorizontal + 1}px; top: {y + ScrollPositionVertical}px;"
>
	{#each definition.groups as group}
		<ul>
			{#each group.entries as entry}
				<li
					on:click={entry.action}
					class="text-white hover:bg-neutral-600 m-0.5 px-2 py-0.5 cursor-pointer"
				>
					{entry.title}
				</li>
			{/each}
		</ul>
	{/each}
</div>
