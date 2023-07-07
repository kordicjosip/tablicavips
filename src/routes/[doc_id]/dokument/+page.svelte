<script lang="ts">
	import type { DokumentRed } from '$components/VipsTableOCR';

	export let data;

	let testData;
	async function writeToVips() {
		const res = await fetch('/api', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		testData = await res.json();
		console.log(testData);
	}

	function sendRowData(row: DokumentRed) {
		row.disabled = true;
		data = data;

		console.log(row.cells);
		writeToVips();
	}
</script>

<table>
	<thead>
		<tr>
			{#each data.table.columns as header}
				<th>{header.name}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data.table.tablica as row}
			<tr>
				{#each row.cells as cell}
					{#if !row.disabled}
						<td contenteditable class:bg-green-300={row.disabled} bind:textContent={cell.text}
							>{cell.text}</td
						>
					{:else}
						<td class:bg-green-300={row.disabled}>{cell.text}</td>
					{/if}
				{/each}
				<td class:bg-green-300={row.disabled}>
					{#if row.disabled}
						<button class="block m-auto" disabled>
							<svg
								class="sent"
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0" />
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
								<g id="SVGRepo_iconCarrier">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M20.6097 5.20743C21.0475 5.54416 21.1294 6.17201 20.7926 6.60976L10.7926 19.6098C10.6172 19.8378 10.352 19.9793 10.0648 19.9979C9.77765 20.0166 9.49637 19.9106 9.29289 19.7072L4.29289 14.7072C3.90237 14.3166 3.90237 13.6835 4.29289 13.2929C4.68342 12.9024 5.31658 12.9024 5.70711 13.2929L9.90178 17.4876L19.2074 5.39034C19.5441 4.95258 20.172 4.87069 20.6097 5.20743Z"
										fill="#000000"
									/>
								</g>
							</svg>
						</button>
					{:else}
						<button
							class="block m-auto"
							on:click={() => {
								sendRowData(row);
								row.cells.removeAttribute('contenteditable');
							}}
						>
							<svg
								class="send"
								width="24px"
								height="24px"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0" />
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
								<g id="SVGRepo_iconCarrier">
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z"
										fill="#000000"
									/>
								</g>
							</svg>
						</button>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
	}

	tr:nth-of-type(odd) {
		background-color: #f3f3f3;
	}

	th,
	td {
		border: 2px solid #d5d5d5;
		padding: 6px;
	}

	th {
		background-color: #ffffff;
	}

	button > svg {
		display: none;
	}

	button:is([disabled]) > svg.sent {
		display: block;
	}

	button:not([disabled]) > svg.send {
		display: block;
	}
</style>
