<script lang="ts">
    import "../../app.css";
    import { COLUMN_HEADER_HEIGHT } from "./index";
    import { onMount } from "svelte";

    export let onRightClick: Function = null;

    onMount(async () => {
        document
            .getElementById(`column-header`)
            .addEventListener("contextmenu", (event: PointerEvent) => {
                event.preventDefault();
                onRightClick(event);
            });

    });
</script>

<g id="column-header">
    <svg>
        <rect width="100%" height={COLUMN_HEADER_HEIGHT} fill="lightgray"/>
    </svg>

</g>
