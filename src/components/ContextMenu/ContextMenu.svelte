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

	let windowWidth: number;
	let windowHeight: number;

	let ContextMenuWidth: number;
	let ContextMenuHeight: number;
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div
	bind:clientWidth={ContextMenuWidth}
	bind:clientHeight={ContextMenuHeight}
	id="context-menu"
	class="absolute bg-neutral-700 border border-gray-400 text-white h-auto w-auto"
	class:invisible={visible === false}
	style="
		left: {x + ScrollPositionHorizontal + ContextMenuWidth + 1 > windowWidth
		? windowWidth - ContextMenuWidth - 5
		: x + ScrollPositionHorizontal + 1}px;
		top: {y + ScrollPositionVertical + ContextMenuHeight > windowHeight
		? windowHeight - ContextMenuHeight - 3
		: y + ScrollPositionVertical}px;">
	{#each definition.groups as group}
		<ul>
			{#each group.entries as entry}
				<li>
					<button
						on:click={entry.action}
						class="text-white text-left hover:bg-neutral-600 px-3 py-1 cursor-pointer w-full h-full">
						{entry.title}
					</button>
				</li>
			{/each}
		</ul>
	{/each}
</div>
