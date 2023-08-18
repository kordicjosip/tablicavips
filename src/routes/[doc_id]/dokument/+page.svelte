<script lang="ts">
	import type { DokumentRed } from '$components/VipsTableOCR';
	import { Field } from '$components/VipsTableOCR/field';
	import { PUBLIC_API_URL } from '$env/static/public';
	import {
		getArtiklPoKataloskomBroju,
		getArtiklPoSifri,
		getArtiklPoBarKodu
	} from '$components/api';
	import { validateColumnRegex, validateInputNumeric } from '$components/validators';
	import { dokumenti } from '$components/VipsTableOCR/dokumenti';
	import { columnTypes, Parametar } from '$components/VipsTableOCR/columnTypes';
	import { goto, invalidateAll } from '$app/navigation';
	import OCRPreview from '$components/VipsTableOCR/OCRPreview.svelte';
	import { onMount } from 'svelte';
	import { povezaniDokumenti } from '$components/store';

	export let data;

	let podaciZaPovezivanje = {
		vipsID: '',
		dokID: ''
	};
	let vipsDocument = null;
	$: indexPovezanogDok = $povezaniDokumenti?.findIndex(
		(dokument) => dokument.id === data.documentData.id
	);
	$: {
		vipsDocument = data.vipsDocument;
		if (vipsDocument) {
			datumDokumenta = new Date(vipsDocument['Datum dokumenta']);
			const potrebniParametri: string[] = dokumenti[vipsDocument['Tip ID']].potrebniParametri;
			const columnsToRemove = data.table.columns.filter(
				(column) => potrebniParametri.indexOf(column.parameter) === -1
			);
			for (const column of columnsToRemove) {
				data.table.columns.splice(data.table.columns.indexOf(column), 1);
				data.table.tablica.forEach((row) => {
					row.cells.splice(
						row.cells.indexOf(row.cells.find((cell) => cell.colParam === column.parameter)),
						1
					);
				});
			}
			for (const potrebniParametar of potrebniParametri) {
				const column = data.table.columns.find((column) => column.parameter === potrebniParametar);
				if (column == undefined) {
					data.table.columns.push(
						columnTypes.find((column) => column.parameter === potrebniParametar)
					);
					data.table.tablica.forEach((row) => {
						row.cells.push({
							text: '',
							data: null,
							colParam: potrebniParametar,
							rowNumber: row.rowNumber
						});
					});
				}
			}
		}
		console.log(vipsDocument, data);

		data.table = data.table;
	}
	let datumDokumenta = null;
	let OCRPreviewData: {
		stranica: number;
		x: number;
		y: number;
		width: number;
		height: number;
	} = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		stranica: 0
	};
	let OCRPreviewVisible = false;
	let initial = true;

	async function selectVipsDocumentFromEvent(event: InputEvent) {
		await selectVipsDocument((event.target as HTMLInputElement).value);
	}

	async function selectVipsDocument(docUID: string) {
		$povezaniDokumenti = $povezaniDokumenti?.filter(
			(dokument) => dokument.id !== data.documentData.id
		);
		await invalidateAll();
		data.vipsDocument = await fetch(`/api/document/${encodeURIComponent(docUID)}`, {
			method: 'GET'
		}).then((res) => res.json());
		await poveziDokument();
		data.vipsDocument = data.vipsDocument;
	}

	console.log(data);
	async function poveziDokument() {
		podaciZaPovezivanje.vipsID = data.vipsDocument['Dokument ID'];
		podaciZaPovezivanje.dokID = data.documentData.id;

		const res = await fetch(`${PUBLIC_API_URL}/api/doc/${data.documentData.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				vips_id: podaciZaPovezivanje.vipsID,
				dokument_id: podaciZaPovezivanje.dokID
			})
		});
		const json = await res.json();
		console.log(JSON.stringify(json));
		$povezaniDokumenti = [
			...$povezaniDokumenti,
			{
				naziv: data.documentData.naziv,
				id: data.documentData.id,
				datum: datumDokumenta,
				vipsID: vipsDocument['JMB Dokumenta'],
				upisaneStavke: []
			}
		];
	}

	async function sendRowData(row: DokumentRed) {
		if (vipsDocument['DokZakljucen']) {
			alert('Dokument je zaključen!');
			return;
		}
		for (const columnIndex in data.table.columns) {
			let artiklCell = row.cells.find((cell) => cell.colParam === Parametar.artikl);
			if (artiklCell.data == undefined || artiklCell.data == null) {
				alert('Artikl nije pronađen!');
				return;
			}
		}
		row.cells.forEach((cell) =>
			cell.text === ''
				? (cell.text =
						columnTypes.find((type) => type.parameter === cell.colParam)?.emptyValue === null
							? ''
							: String(columnTypes.find((type) => type.parameter === cell.colParam)?.emptyValue))
				: ''
		);
		row.cells.forEach((cell) =>
			cell.data === null
				? (cell.data =
						columnTypes.find((type) => type.parameter === cell.colParam)?.emptyValue === null
							? null
							: columnTypes.find((type) => type.parameter === cell.colParam)?.emptyValue)
				: null
		);
		data = data;
		if (row.cells.find((cell) => cell.text === '')) {
			setTimeout(() => {
				alert('Neka polja su prazna!');
			}, 0);
			return;
		}
		row.disabled = true;
		data = data;
		console.log(row.cells);

		const request = {};
		for (const cellId in row.cells) {
			switch (data.table.columns[cellId].field) {
				case Field.artiklPoSifri:
					request[row.cells[cellId].colParam] = row.cells[cellId].data.ID;
					break;
				case Field.artiklPoKataloskomBroju:
					request[row.cells[cellId].colParam] = row.cells[cellId].data.ID;
					break;
				case Field.artiklPoBarKodu:
					request[row.cells[cellId].colParam] = row.cells[cellId].data.ID;
					break;
				default:
					request[row.cells[cellId].colParam] = row.cells[cellId].data;
					break;
			}
		}
		await fetch(`/api/document/${encodeURIComponent(vipsDocument['JMB Dokumenta'])}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});

		if ($povezaniDokumenti) {
			$povezaniDokumenti[indexPovezanogDok].upisaneStavke = [
				...$povezaniDokumenti[indexPovezanogDok].upisaneStavke,
				{
					artikl: row.cells[0].data.Naziv,
					kolicina: row.cells[1].data
						? row.cells[1].data
						: columnTypes.find((type) => type.parameter === row.cells[1].colParam)?.emptyValue
				}
			];
		}
	}

	function sendAllRowsData() {
		data.table.tablica.forEach((row) => {
			for (const columnIndex in row.cells) {
				if (
					row.cells[columnIndex].data == undefined ||
					row.cells[columnIndex].data == null ||
					row.disabled
				) {
					return;
				} else {
					sendRowData(row);
				}
			}
		});
	}
	function setOCRPreviewData(cell) {
		OCRPreviewData.x = cell.x1;
		OCRPreviewData.y = cell.y1;
		OCRPreviewData.width = cell.x2 - cell.x1;
		OCRPreviewData.height = cell.y2 - cell.y1;
		OCRPreviewData.stranica = cell.stranica;
	}

	onMount(() => {
		initial = false;
	});
</script>

<div class="w-screen h-screen flex flex-col">
	<div
		class="grid grid-cols-4 bg-emerald-700 h-20 items-center justify-items-center text-white flex-shrink-0 text-sm lg:text-base">
		<div class="flex justify-around w-full">
			<div
				class="w-8 h-8 p-0.5 rounded-full hover:bg-emerald-800 hover:cursor-pointer"
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
			<div class="items-center">
				<input
					class="relative bg-transparent border-b-2 border-white text-white text-center focus:drop-shadow-none placeholder-white placeholder-opacity-50"
					on:input={selectVipsDocumentFromEvent}
					value={data.vipsDocument ? data.vipsDocument['JMB Dokumenta'] : ''}
					placeholder="Unesi broj dokumenta:"
					size="17"
					type="text" />
				{#if vipsDocument}
					{#if vipsDocument['DokZakljucen']}
						<div class="flex justify-center">
							<h1 class="absolute text-white font-bold">Dokument je zaključen!</h1>
						</div>
					{/if}
				{/if}
			</div>
		</div>
		{#if vipsDocument}
			<div>
				<div>
					<span class="font-semibold">Naziv komitenta: </span>{vipsDocument['Naziv komitenta']}
				</div>
				<div>
					<span class="font-semibold"
						>Datum dokumenta:
					</span>{datumDokumenta.getUTCDate()}.{datumDokumenta.getUTCMonth()}.{datumDokumenta.getUTCFullYear()}.
				</div>
				<div>
					<span class="font-semibold">Komercijalist: </span>{vipsDocument['Komercijalist']}
				</div>
			</div>
			<div>
				<div>
					<span class="font-semibold">Broj računa: </span>{vipsDocument['Broj računa']}
				</div>
				<div>
					<span class="font-semibold">Tip dokumenta: </span>{vipsDocument['Tip dokumenta']}
				</div>
				<div>
					<span class="font-semibold">Podtip dokumenta: </span>{vipsDocument['Podtip dokumenta']}
				</div>
			</div>
			<div>
				<div>
					<span class="font-semibold">Ulaz VPV: </span>{vipsDocument['UlazVPV']}
				</div>
				<div>
					<span class="font-semibold">Valuta: </span>{vipsDocument['Valuta']}
				</div>
				<div>
					<span class="font-semibold">Dug: </span>{vipsDocument['Dug']}
				</div>
			</div>
		{:else}
			<div class="w-full flex flex-col items-center">
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
			</div>
			<div class="w-full flex flex-col items-center">
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
			</div>
			<div class="w-full flex flex-col items-center">
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
				<div class="w-3/4 rounded-md h-3 m-1 animate-pulse bg-emerald-600" />
			</div>
		{/if}
	</div>

	<div class="overflow-x-scroll h-full px-5">
		{#if $povezaniDokumenti[indexPovezanogDok] && $povezaniDokumenti[indexPovezanogDok].upisaneStavke.length > 0}
			<table class="pb-5 pt-3">
				<thead>
					<tr style="background: white">Već upisane stavke:</tr>
					<tr>
						<th>Artikl</th>
						<th>Količina</th>
					</tr>
				</thead>
				<tbody>
					{#each $povezaniDokumenti[indexPovezanogDok].upisaneStavke as stavka}
						<tr>
							<td class="bg-green-300">{stavka.artikl}</td>
							<td class="bg-green-300 text-right">{stavka.kolicina}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}

		<table>
			<thead class="select-none sticky -top-[1px] whitespace-nowrap">
				<tr>
					{#each data.table.columns as header}
						{#if header.field === Field.artiklPoSifri}
							<th colspan="2">Šifra</th>
						{:else if header.field === Field.artiklPoKataloskomBroju}
							<th colspan="2">Kataloški broj</th>
						{:else if header.field === Field.artiklPoBarKodu}
							<th colspan="2">Barkod</th>
						{:else}
							<th>{header.name}</th>
						{/if}
					{/each}
					{#if vipsDocument}
						<th>
							<button
								class="block m-auto"
								title="Upiši sve moguće redove"
								on:click={sendAllRowsData}>
								<svg
									class="send"
									height="22px"
									viewBox="0 0 24 24"
									width="22px"
									xmlns="http://www.w3.org/2000/svg">
									<g id="SVGRepo_bgCarrier" stroke-width="0" />
									<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
									<g id="SVGRepo_iconCarrier">
										<defs>
											<style>
												.cls-1 {
													fill: none;
													stroke: #020202;
													stroke-miterlimit: 10;
													stroke-width: 1.91px;
												}
											</style>
										</defs>
										<path
											class="cls-1"
											d="M1.5,18.68H8.18A3.82,3.82,0,0,1,12,22.5v0a0,0,0,0,1,0,0H1.5a0,0,0,0,1,0,0V18.68A0,0,0,0,1,1.5,18.68Z" />
										<path
											class="cls-1"
											d="M15.82,18.68H22.5a0,0,0,0,1,0,0V22.5a0,0,0,0,1,0,0H12a0,0,0,0,1,0,0v0A3.82,3.82,0,0,1,15.82,18.68Z" />
										<path
											class="cls-1"
											d="M1.5,6.27H8.18A3.82,3.82,0,0,1,12,10.09V22.5a0,0,0,0,1,0,0H1.5a0,0,0,0,1,0,0V6.27A0,0,0,0,1,1.5,6.27Z" />
										<path
											class="cls-1"
											d="M19.64,6.27H22.5V22.5H12V10.09a3.82,3.82,0,0,1,3.82-3.82" />
										<path
											class="cls-1"
											d="M19.64,13l-1.91,1.91L15.82,13V3.41A1.9,1.9,0,0,1,17.73,1.5h0a1.91,1.91,0,0,1,1.91,1.91Z" />
									</g>
								</svg>
							</button>
						</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each data.table.tablica as row}
					<tr>
						{#each row.cells as cell, i (cell.colParam + cell.rowNumber)}
							{#if !row.disabled}
								{#if data.table.columns[i].field === Field.artiklPoSifri}
									<td
										on:focusin={() => {
											setOCRPreviewData(cell);
											OCRPreviewVisible = true;
										}}
										on:focusout={() => (OCRPreviewVisible = false)}
										>{#if data.table.columns[i].regexString}
											<input
												size="14"
												class="bg-transparent text-right"
												class:bg-red-300={cell.text === ''}
												type="text"
												value={validateColumnRegex(
													cell.text,
													data.table.columns[i].regexString,
													cell.initial ? cell.initial : true
												)}
												on:input={async (event) => {
													cell.initial = false;
													cell.data = await getArtiklPoSifri(event.target.value, fetch);
													cell.text = event.target.value;
												}} />
										{:else}
											<input
												size="14"
												class="bg-transparent text-right"
												class:bg-red-300={cell.text === ''}
												type="text"
												bind:value={cell.text}
												on:input={async () => {
													cell.data = await getArtiklPoSifri(cell.text, fetch);
												}} />
										{/if}
									</td>
									<td
										class="text-gray-700 select-none whitespace-nowrap"
										class:bg-red-300={!cell.data}>{cell.data ? cell.data.Naziv : 'Ne postoji'}</td>
								{:else if data.table.columns[i].field === Field.artiklPoKataloskomBroju}
									<td
										on:focusin={() => {
											setOCRPreviewData(cell);
											OCRPreviewVisible = true;
										}}
										on:focusout={() => (OCRPreviewVisible = false)}
										>{#if data.table.columns[i].regexString}
											<input
												size="14"
												class="bg-transparent text-right"
												class:bg-red-300={cell.text === ''}
												type="text"
												value={validateColumnRegex(
													cell.text,
													data.table.columns[i].regexString,
													cell.initial ? cell.initial : true
												)}
												on:input={async (event) => {
													cell.initial = false;
													cell.data = await getArtiklPoKataloskomBroju(event.target.value, fetch);
													cell.text = event.target.value;
												}} />
										{:else}
											<input
												size="14"
												class="bg-transparent text-right"
												class:bg-red-300={cell.text === ''}
												type="text"
												bind:value={cell.text}
												on:input={async () => {
													cell.data = await getArtiklPoKataloskomBroju(cell.text, fetch);
												}} />
										{/if}
									</td>
									<td class="text-gray-700 whitespace-nowrap" class:bg-red-300={!cell.data}
										>{cell.data ? cell.data.Naziv : 'Ne postoji'}</td>
								{:else if data.table.columns[i].field === Field.artiklPoBarKodu}
									<td
										on:focusin={() => {
											setOCRPreviewData(cell);
											OCRPreviewVisible = true;
										}}
										on:focusout={() => (OCRPreviewVisible = false)}>
										{#if data.table.columns[i].regexString}
											<input
												size="14"
												class="bg-transparent text-right"
												class:bg-red-300={cell.text === ''}
												type="text"
												value={validateColumnRegex(
													cell.text,
													data.table.columns[i].regexString,
													cell.initial ? cell.initial : true
												)}
												on:input={async (event) => {
													cell.initial = false;
													cell.data = await getArtiklPoBarKodu(event.target.value, fetch);
													cell.text = event.target.value;
												}} />
										{:else}
											<input
												size="14"
												class="bg-transparent text-right"
												class:bg-red-300={cell.text === ''}
												type="text"
												bind:value={cell.text}
												on:input={async () => {
													cell.data = await getArtiklPoBarKodu(cell.text, fetch);
												}} />
										{/if}
									</td>
									<td
										class="text-gray-700 select-none whitespace-nowrap"
										class:bg-red-300={!cell.data}>{cell.data ? cell.data.Naziv : 'Ne postoji'}</td>
								{:else if data.table.columns[i].field === Field.numeric}
									<td
										class="whitespace-nowrap"
										on:focusin={() => {
											setOCRPreviewData(cell);
											OCRPreviewVisible = true;
										}}
										on:focusout={() => (OCRPreviewVisible = false)}
										class:bg-red-300={cell.text === '' || cell.data === null}
										class:bg-yellow-300={cell.text === '' &&
											data.table.columns[i].defaultValue !== null}
										><input
											size="10"
											class="bg-transparent text-right"
											type="text"
											bind:value={cell.text}
											on:input={async () => {
												cell.data = validateInputNumeric(cell.text);
											}} />
										{#if data.table.columns[i].parameter === Parametar.rabat1 || data.table.columns[i].parameter === Parametar.rabat2 || data.table.columns[i].parameter === Parametar.rabat3}
											<span class="select-none">%</span>
										{/if}
									</td>
								{:else}
									<td
										on:focusin={() => {
											setOCRPreviewData(cell);
											OCRPreviewVisible = true;
										}}
										on:focusout={() => (OCRPreviewVisible = false)}
										class:bg-green-300={row.disabled}
										class:bg-yellow-300={cell.text === '' &&
											data.table.columns[i].defaultValue !== null}
										class:bg-red-300={cell.text === ''}
										contenteditable
										bind:textContent={cell.text}
										class="text-right">{cell.text}</td>
								{/if}
							{:else if data.table.columns[i].field === Field.artiklPoSifri}
								<td class:bg-green-300={row.disabled} class="text-right">{cell.text}</td>
								<td
									class="text-gray-700 select-none whitespace-nowrap text-left"
									class:bg-green-300={row.disabled}
									>{cell.data ? cell.data.Naziv : 'Ne postoji'}</td>
							{:else if data.table.columns[i].field === Field.artiklPoKataloskomBroju}
								<td class:bg-green-300={row.disabled} class="text-right">{cell.text}</td>
								<td
									class="text-gray-700 select-none whitespace-nowrap text-left"
									class:bg-green-300={row.disabled}
									>{cell.data ? cell.data.Naziv : 'Ne postoji'}</td>
							{:else if data.table.columns[i].field === Field.artiklPoBarKodu}
								<td class:bg-green-300={row.disabled} class="text-right">{cell.text}</td>
								<td
									class="text-gray-700 select-none whitespace-nowrap text-left"
									class:bg-green-300={row.disabled}
									>{cell.data ? cell.data.Naziv : 'Ne postoji'}</td>
							{:else if data.table.columns[i].field === Field.numeric}
								<td class:bg-green-300={row.disabled} class="text-right"
									>{cell.text}
									{#if data.table.columns[i].parameter === Parametar.rabat1 || data.table.columns[i].parameter === Parametar.rabat2 || data.table.columns[i].parameter === Parametar.rabat3}
										<span>%</span>
									{/if}</td>
							{:else}
								<td class:bg-green-300={row.disabled} class="text-right">{cell.text}</td>
							{/if}
						{/each}
						{#if vipsDocument}
							<td class:bg-green-300={row.disabled}>
								{#if row.disabled}
									<button title="Red spremljen" class="block m-auto" disabled>
										<svg
											class="sent"
											width="24px"
											height="24px"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<g id="SVGRepo_bgCarrier" stroke-width="0" />
											<g
												id="SVGRepo_tracerCarrier"
												stroke-linecap="round"
												stroke-linejoin="round" />
											<g id="SVGRepo_iconCarrier">
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M20.6097 5.20743C21.0475 5.54416 21.1294 6.17201 20.7926 6.60976L10.7926 19.6098C10.6172 19.8378 10.352 19.9793 10.0648 19.9979C9.77765 20.0166 9.49637 19.9106 9.29289 19.7072L4.29289 14.7072C3.90237 14.3166 3.90237 13.6835 4.29289 13.2929C4.68342 12.9024 5.31658 12.9024 5.70711 13.2929L9.90178 17.4876L19.2074 5.39034C19.5441 4.95258 20.172 4.87069 20.6097 5.20743Z"
													fill="#000000" />
											</g>
										</svg>
									</button>
								{:else}
									<button title="Spremi red" class="block m-auto" on:click={() => sendRowData(row)}>
										<svg
											class="send"
											width="24px"
											height="24px"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg">
											<g id="SVGRepo_bgCarrier" stroke-width="0" />
											<g
												id="SVGRepo_tracerCarrier"
												stroke-linecap="round"
												stroke-linejoin="round" />
											<g id="SVGRepo_iconCarrier">
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z"
													fill="#000000" />
											</g>
										</svg>
									</button>
								{/if}
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
{#if data.table.tablica[0] && OCRPreviewData.stranica !== undefined && OCRPreviewVisible}
	<OCRPreview
		tablicaId={data.documentData['stranice'][OCRPreviewData.stranica].id}
		x={OCRPreviewData.x}
		y={OCRPreviewData.y}
		width={OCRPreviewData.width}
		height={OCRPreviewData.height} />
{/if}

<style>
	table {
		border-collapse: separate;
		border-spacing: 0;
	}

	tr:nth-of-type(odd) {
		background-color: #f3f3f3;
	}

	th,
	td {
		border: 1px solid #d5d5d5;
		padding: 3px;
	}

	th {
		background-color: #ffffff;
		border-bottom: 2px solid #d5d5d5;
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
