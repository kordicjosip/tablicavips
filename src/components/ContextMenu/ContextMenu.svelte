<script lang="ts">
  import {ContextMenuDefinition} from "./index";

  export let definition = new ContextMenuDefinition();

  export let x = 0;
  export let y = 0;
  export let visible = false;

  // TODO animate visibility
</script>

<div
  id="context-menu"
  class="bg-amber-400 text-black"
  class:invisible={visible === false}
  style="top: {y}px; left: {x}px;"
>
  {#each definition.groups as group}
    <ul class="border-8">
      {#each group.entries as entry}
        <li on:click={entry.action} class="border-2">{entry.title}</li>
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
