<script lang="ts">
  export let width: number;
  export let height: number;
  export let x: number;
  export let y: number;
</script>

<g transform="translate({x} {y})">
  <rect
    {width}
    {height}
    fill="gray"></rect>
</g>
