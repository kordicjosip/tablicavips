<script lang="ts">
    import {ContextMenuDefinition} from "./index";

    export let definition = new ContextMenuDefinition();

    export let x = 0;
    export let y = 0;
    export let visible = false;
</script>

<div
        id="context-menu"
        class="bg-cyan-700 text-white"
        class:invisible={visible === false}
        style="top: {y}px; left: {x}px;"
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