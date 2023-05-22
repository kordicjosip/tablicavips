<script lang="ts">
    import "../../app.css";
    import { DataTableRow, type DataTableRowInterface, ROW_HEADER_WIDTH} from "./index";
    import {onMount} from "svelte";
    import {drag, select} from "d3";

    export let row: DataTableRow;
    export let onRightClick: (event: PointerEvent, row: DataTableRowInterface)=>void = null;

    onMount(async () => {
        select(`#row-header-${row.id}`).call(
            drag()
                .on("drag", function (event: any) {
                    select(`#row-header-${row.id}`)
                    row.y1 += event.dy;
                    row.y2 += event.dy;
                    if (row.y1 < 0) {
                        let visina = row.height
                        row.y1 = 0;
                        row.y2 = visina;
                    }
                })
        );

        document
            .getElementById(`row-header-${row.id}`)
            .addEventListener("contextmenu", (event: PointerEvent) => {
                event.preventDefault();
                onRightClick(event, row);
            });
    });
</script>

<g id="row-header-{row.id}" transform="translate(0 {row.y1})">
    <svg
            class="cursor-grab fill-teal-400 hover:fill-teal-500"
            height={row.height}
            width={ROW_HEADER_WIDTH}
    >
        <rect height={row.height} stroke="black" width={ROW_HEADER_WIDTH}/>
        <text
                class="fill-black"
                dominant-baseline="central"
                font-size="10pt"
                text-anchor="end"
                x={ROW_HEADER_WIDTH - 1}
                y={row.height / 2}>{row.name === null ? row.id : row.name}</text
        >
    </svg>
</g>
