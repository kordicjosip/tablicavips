<script lang="ts">
    import "../../app.css";
    import { ROW_HEADER_WIDTH } from "./index";
    import { onMount } from "svelte";

    export let height: number = 0;
    export let onRightClick: Function = null;

    onMount(async () => {
        document
            .getElementById(`row-header`)
            .addEventListener("contextmenu", (event: PointerEvent) => {
                event.preventDefault();
                onRightClick(event);
            });
    });
</script>

<g id="row-header">
    <rect height={height} width={ROW_HEADER_WIDTH} fill="lightgray"></rect>
</g>
