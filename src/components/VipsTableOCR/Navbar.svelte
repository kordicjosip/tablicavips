<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ColumnTemplatesDialog from './ColumnTemplatesDialog.svelte';
	import { goto } from '$app/navigation';

	let dialog;
	const dispatch = createEventDispatcher();
	export let scale: number;
	export let numberOfPages: number | null;
	export let currentPage: number | null;
	export let isUnlinked: boolean;
	export let columnTemplatesData: [];
	let selectedColumnTemplate;

	function postColumnTemplate(event) {
		dispatch('postColumnTemplate', event.detail);
	}

	function getColumnTemplates() {
		dispatch('getColumnTemplates');
	}

	$: scalePercent = Math.round(scale * 100);

	function changeColumnTemplate() {
		dispatch('changeColumnTemplate', selectedColumnTemplate['definicija']['stupci']);
	}
</script>

<div class="flex justify-between items-center px-10 h-10 bg-emerald-700 w-full">
	<div
		class="flex items-center justify-center w-8 h-8 p-0.5 rounded-full hover:bg-emerald-800 hover:cursor-pointer"
		on:click={() => {
			goto('/');
		}}
		title="Početna">
		<svg fill="#ffffff" viewBox="-4.2 -4.2 29.40 29.40" xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" stroke-width="0" />
			<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
			<g id="SVGRepo_iconCarrier">
				<defs />
				<g fill="none" fill-rule="evenodd" id="Page-1" stroke-width="0.00021000000000000004">
					<g
						fill="#ffffff"
						id="Dribbble-Light-Preview"
						transform="translate(-419.000000, -720.000000)">
						<g id="icons" transform="translate(56.000000, 160.000000)">
							<path
								d="M379.79996,578 L376.649968,578 L376.649968,574 L370.349983,574 L370.349983,578 L367.19999,578 L367.19999,568.813 L373.489475,562.823 L379.79996,568.832 L379.79996,578 Z M381.899955,568.004 L381.899955,568 L381.899955,568 L373.502075,560 L363,569.992 L364.481546,571.406 L365.099995,570.813 L365.099995,580 L372.449978,580 L372.449978,576 L374.549973,576 L374.549973,580 L381.899955,580 L381.899955,579.997 L381.899955,570.832 L382.514204,571.416 L384.001,570.002 L381.899955,568.004 Z"
								id="home" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	</div>

	<div class="flex justify-center items-center text-white text-lg font-semibold gap-20">
		{#if numberOfPages > 0}
			<div>
				<input
					class="{isUnlinked ? 'cursor-default' : 'cursor-pointer'} accent-white"
					type="checkbox"
					id="otkači stranicu"
					bind:checked={isUnlinked}
					on:change={() => dispatch('toggleUnlink', isUnlinked)}
					name="zaključaj" />
				{#if isUnlinked}
					<label for="otkači stranicu" class="text-base">Stranica otkačena</label>
				{:else}
					<label for="otkači stranicu" class="text-base">Otkači ovu stranicu</label>
				{/if}
			</div>
			<div class="flex items-center">
				<button
					class="w-7 h-7 hover:bg-emerald-800 rounded-full m-1"
					on:click={() => (currentPage = Math.max(currentPage - 1, 0))}
					>&lt;
				</button>
				<div>{currentPage + 1}/{numberOfPages}</div>
				<button
					class="w-7 h-7 hover:bg-emerald-800 rounded-full m-1"
					on:click={() => (currentPage = Math.min(currentPage + 1, numberOfPages - 1))}
					>&gt;
				</button>
			</div>

			<div class="flex items-center">
				<button
					class="w-7 h-7 hover:bg-emerald-800 rounded-full m-1"
					on:click={() => (scale = Math.max(scale - 0.05, 0.01))}
					>-
				</button>
				<div class="select-none">{scalePercent}%</div>
				<button
					class="w-7 h-7 hover:bg-emerald-800 rounded-full m-1"
					on:click={() => (scale = Math.min(scale + 0.05, 2.5))}
					>+
				</button>
			</div>

			<div
				title="Predlošci stupaca"
				class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-emerald-800 hover:cursor-pointer"
				on:click={dialog.show}>
				<svg
					width="80px"
					height="80px"
					viewBox="-6.24 -6.24 36.48 36.48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<g id="SVGRepo_bgCarrier" stroke-width="0" />
					<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
					<g id="SVGRepo_iconCarrier">
						<path
							d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z"
							stroke="#ffffff"
							stroke-width="1.7759999999999998" />
						<path d="M3 16.5H21" stroke="#ffffff" stroke-width="1.7759999999999998" />
						<path d="M3 12H21" stroke="#ffffff" stroke-width="1.7759999999999998" />
						<path d="M21 7.5H3" stroke="#ffffff" stroke-width="1.7759999999999998" />
						<path d="M12 21V3" stroke="#ffffff" stroke-width="1.7759999999999998" />
					</g>
				</svg>
			</div>
		{/if}
	</div>

	<div
		class="flex items-center justify-center w-7 h-7 rounded-full hover:bg-emerald-800 hover:cursor-pointer"
		on:click={() => {
			dispatch('sendAllData');
		}}
		title="Pošalji podatke">
		<svg fill="#ffffff" viewBox="-6.8 -6.8 33.60 33.60" xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" stroke-width="0" />
			<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
			<g id="SVGRepo_iconCarrier"
				><title>file_arrow_up [#ffffff]</title>
				<desc>Created with Sketch.</desc>
				<defs />
				<g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
					<g
						fill="#ffffff"
						id="Dribbble-Light-Preview"
						transform="translate(-340.000000, -1839.000000)">
						<g id="icons" transform="translate(56.000000, 160.000000)">
							<path
								d="M288.4879,1691.0005 L289.0189,1691.0005 C289.4649,1691.0005 289.6879,1691.7495 289.3709,1692.0645 L284.2879,1697.2245 C283.9059,1697.6045 283.9039,1698.2755 284.2839,1698.6585 C284.6659,1699.0445 285.2899,1699.0705 285.6719,1698.6855 L290.9319,1693.6115 C291.2459,1693.2945 291.9999,1693.5295 291.9999,1693.9765 L291.9999,1694.4195 C291.9999,1694.9715 292.4479,1695.4195 292.9999,1695.4195 C293.5519,1695.4195 293.9999,1694.9715 293.9999,1694.4195 L293.9999,1691.4195 C293.9999,1690.3145 292.6779,1689.0005 291.5739,1689.0005 L288.4879,1689.0005 C287.9409,1689.0005 287.4959,1689.4395 287.4879,1689.9855 C287.4799,1690.5435 287.9299,1691.0005 288.4879,1691.0005 M303.9999,1685.4915 L303.9999,1697.0005 C303.9999,1698.1045 303.1049,1699.0005 301.9999,1699.0005 L292.9999,1699.0005 C292.4479,1699.0005 291.9999,1698.5525 291.9999,1698.0005 C291.9999,1697.4485 292.4479,1697.0005 292.9999,1697.0005 L300.9999,1697.0005 C301.5519,1697.0005 301.9999,1696.5525 301.9999,1696.0005 L301.9999,1687.0005 L297.9999,1687.0005 C296.8959,1687.0005 295.9999,1686.1045 295.9999,1685.0005 L295.9999,1681.0005 L286.9999,1681.0005 C286.4479,1681.0005 285.9999,1681.4485 285.9999,1682.0005 L285.9999,1690.0005 C285.9999,1690.5525 285.5519,1691.0005 284.9999,1691.0005 C284.4479,1691.0005 283.9999,1690.5525 283.9999,1690.0005 L283.9999,1681.0005 C283.9999,1679.8955 284.8959,1679.0005 285.9999,1679.0005 L297.5819,1679.0005 C297.8489,1679.0005 298.1059,1679.1075 298.2939,1679.2985 L303.7119,1684.7895 C303.8969,1684.9765 303.9999,1685.2285 303.9999,1685.4915"
								id="file_arrow_up-[#ffffff]" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	</div>
</div>
<ColumnTemplatesDialog
	bind:columnTemplatesData
	bind:selectedColumnTemplate
	bind:this={dialog}
	on:changeColumnTemplate={changeColumnTemplate}
	on:getColumnTemplates={getColumnTemplates}
	on:postColumnTemplate={postColumnTemplate} />
