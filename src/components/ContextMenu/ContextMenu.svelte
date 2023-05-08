<script lang="ts">
    import {ContextMenuDefinition} from "./index";
    import {onMount} from "svelte";

    export let definition = new ContextMenuDefinition();

    export let x = 0;
    export let y = 0;
    export let visible = false;

    let ScrollPositionVertical = 0;
    let ScrollPositionHorizontal = 0;
    onMount(async () => {
        document.addEventListener("scroll", (event) => {
            ScrollPositionHorizontal = window.scrollX;
            ScrollPositionVertical = window.scrollY;
        });
    })
</script>

<div
        id="context-menu"
        class="bg-cyan-700 text-white"
        class:invisible={visible === false}
        style="left: {x+ScrollPositionHorizontal+2}px; top: {y+ScrollPositionVertical}px;"
>
    {#each definition.groups as group}
        <ul>
            {#each group.entries as entry}
                <li on:click={entry.action} class="border-4 p-1">{entry.title}</li>
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
        width: 250px;
    }
</style>