<script lang="ts">
	import { onMount } from 'svelte';
	import { type DokumentRed, OCR, type OCRInterface, TableData, TablesData } from './index';
	import Table from './Table.svelte';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';
	import { goto } from '$app/navigation';
	import { Field } from '$components/VipsTableOCR/field';
	import { columnTypes } from '$components/VipsTableOCR/columnTypes';
	import { getPersisted } from '$components/store';
	import { validateThousands } from '$components/validators';

	export let documentData;
	let data: TablesData = new TablesData();
	let scale = 1;
	let columnTemplateData = null;
	let columnTemplatesData = [];

	function sendAllData() {
		const tablica: {
			columns: { name: string; field: Field; parameter: string; regexString: string }[];
			tablica: DokumentRed[];
		} = {
			columns: [],
			tablica: []
		};
		let mergedRows: DokumentRed[] = [];
		let lastTableRowNumber = 0;
		for (const table of data.tables) {
			const tableColumns = table.columns
				.filter((column) => column.type !== undefined)
				.sort((a, b) => a.x1 - b.x1);
			const tableRows = table.rows.sort((a, b) => a.y1 - b.y1);

			const rows: DokumentRed[] = [];
			for (const rowNumber in tableRows) {
				const row = tableRows[rowNumber];
				rows.push({
					cells: [],
					disabled: false
				});
				for (const columnNumber in tableColumns) {
					const column = tableColumns[columnNumber];
					if (
						tablica.columns.find(
							(column) => column.name === tableColumns[columnNumber].type?.name
						) === undefined
					) {
						tablica.columns.push(column.type!);
					}
					rows[rowNumber].cells.push({
						rowNumber: Number.parseInt(rowNumber) + lastTableRowNumber,
						colParam: column.type?.parameter,
						x1: column.x1,
						x2: column.x2,
						y1: row.y1,
						y2: row.y2,
						text: [],
						stranica: table.page
					});
				}
			}
			lastTableRowNumber += tableRows.length;
			for (const row of rows) {
				for (const cell of row.cells) {
					cell.text = table.ocr.filter((ocr) => {
						return (
							ocr.x1 - table.tableCrop.x1 >= cell.x1 &&
							ocr.x2 - table.tableCrop.x1 <= cell.x2 &&
							ocr.y1 - table.tableCrop.y1 >= cell.y1 &&
							ocr.y2 - table.tableCrop.y1 <= cell.y2
						);
					});
					cell.text.sort((a, b) => a.x1 - b.x1);
					cell.text.sort((a, b) => {
						if (a.y1 > b.y2) return 1;
						if (a.y2 <= b.y1) return -1;
						return 0;
					});
					let previousY2: number | null = null;
					for (let textIndex = 0; textIndex < cell.text.length; textIndex++) {
						if (previousY2 !== null && cell.text[textIndex].y1 > previousY2) {
							cell.text = [
								...cell.text.slice(0, textIndex),
								new OCR({
									x1: cell.text[textIndex].x1,
									x2: cell.text[textIndex].x2,
									y1: cell.text[textIndex].y1,
									y2: cell.text[textIndex].y2,
									text: '\n'
								}),
								...cell.text.slice(textIndex)
							];
						}
						previousY2 = cell.text[textIndex].y2;
					}
				}
			}
			mergedRows = mergedRows.concat(rows);
		}

		for (const row of mergedRows) {
			for (const cell of row.cells) {
				cell.text = validateThousands(cell.text.map((text) => text.text).join(' '));
			}
		}

		tablica.tablica = mergedRows;
		getPersisted(documentData.id).set(tablica);

		if (tablica.columns.length === 0) {
			alert('Niste imenovali nijedan stupac!');
		} else {
			goto('/' + documentData.id + '/dokument');
		}
	}

	function addRow(event) {
		data.addRow(event.detail);
		data = data;
	}

	function removeRow(event) {
		data.removeRow(event.detail);
		data = data;
	}

	function addColumn(event) {
		data.addColumn(event.detail);
		data = data;
	}

	function removeColumn(event) {
		data.removeColumn(event.detail);
		data = data;
	}

	function setColumnType(event) {
		data.setColumnType(event.detail.id, event.detail.column);
		data = data;
		console.log(data);
	}

	function setColumnRegexString(event) {
		data.setColumnRegexString(event.detail.id, event.detail.regexString);
		data = data;
		console.log(data);
	}

	function setOffsetColumnAllTables(event) {
		data.setOffsetColumnAllTables(event.detail.id, event.detail.offset);
	}

	function setOffsetColumnsAllTables(event) {
		data.setOffsetColumnsAllTables(event.detail);
	}

	function dragX1AllTables(event) {
		data.dragX1AllTables(event.detail.id, event.detail.offset);
	}

	function dragX2AllTables(event) {
		data.dragX2AllTables(event.detail.id, event.detail.offset);
	}

	async function getColumnTemplates() {
		columnTemplatesData = await fetch('http://192.168.10.20:8000/api/column_templates', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((data) => {
				data.forEach((predlozak) => {
					predlozak.definicija.stupci = predlozak.definicija.stupci.map((stupac) => {
						return {
							x1: stupac.x1,
							x2: stupac.x2,
							type: columnTypes.find((columnType) => columnType.name === stupac.type)!
						};
					});
				});
				return data;
			});
	}

	async function postColumnTemplate(event) {
		const res = await fetch('http://192.168.10.20:8000/api/column_templates', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				naziv: event.detail,
				stupci: data.currentPageTable
					?.columns!.filter((column) => column.type !== null)
					.map((column) => {
						return {
							x1: column.x1,
							x2: column.x2,
							type: column.type?.name
						};
					})
			})
		});

		const json = await res.json();
		columnTemplateData = JSON.stringify(json);
	}

	function changeColumnTemplate(event) {
		if (!data.currentPageTable?.isUnlinked) {
			data.deleteColumnsAllTables();
			for (let i = 0; i < event.detail.length; i++) {
				data.addColumnsAllTables({
					id: event.detail[i].id,
					name: event.detail[i].type.name,
					type: event.detail[i].type,
					x1: event.detail[i].x1,
					x2: event.detail[i].x2
				});
			}
		} else {
			data.currentPageTable.columns = [];
			for (let i = 0; i < event.detail.length; i++) {
				data.currentPageTable.addColumn({
					id: event.detail[i].id,
					name: event.detail[i].type.name,
					type: event.detail[i].type,
					x1: event.detail[i].x1,
					x2: event.detail[i].x2
				});
			}
		}

		data = data;
	}

	onMount(async () => {
		for (let i = 0; i < documentData['stranice'].length; i++) {
			if (!documentData['stranice'][i]['tablica']) {
				continue;
			}
			const columns = documentData['stranice'][0]['tablica']['definicija'].columns.map(
				(column, index) => {
					return {
						id: index,
						name: null,
						type: undefined,
						x1: column[0],
						x2: column[1],
						get width() {
							return this.x2 - this.x1;
						}
					};
				}
			);
			const rows = documentData['stranice'][i]['tablica']['definicija'].rows.map((row, index) => {
				return {
					id: index,
					name: 'row',
					y1: row[0],
					y2: row[1]
				};
			});
			const ocr: OCRInterface[] = documentData['stranice'][i]['ocr'].map((row) => {
				return {
					text: row.ocr.text,
					x1: row.ocr.x1,
					x2: row.ocr.x2,
					y1: row.ocr.y1,
					y2: row.ocr.y2
				};
			});
			const crop = {
				x1: Number(documentData['stranice'][i]['tablica']['definicija'].crop[0]),
				x2: Number(documentData['stranice'][i]['tablica']['definicija'].crop[2]),
				y1: Number(documentData['stranice'][i]['tablica']['definicija'].crop[1]),
				y2: Number(documentData['stranice'][i]['tablica']['definicija'].crop[3])
			};

			data.addTable(
				new TableData({
					id: documentData['stranice'][i].id,
					columns: columns,
					rows: rows,
					resolution: documentData['stranice'][i]['tablica']['definicija'].resolution,
					image: documentData['stranice'][i]['tablica']['definicija'].image,
					ocr: ocr,
					tableCrop: crop,
					page: i
				})
			);
		}
		data = data;
		await getColumnTemplates();
	});
</script>

<div class="h-full w-full flex flex-col">
	<div>
		<Navbar
			bind:columnTemplatesData
			bind:currentPage={data.currentPage}
			bind:numberOfPages={data.tables.length}
			bind:scale
			isUnlinked={data.currentPageTable?.isUnlinked}
			on:changeColumnTemplate={changeColumnTemplate}
			on:getColumnTemplates={getColumnTemplates}
			on:postColumnTemplate={postColumnTemplate}
			on:sendAllData={sendAllData}
			on:toggleUnlink={(event) => (data.currentPageTable.isUnlinked = event.detail)} />
	</div>
	<div class="basis-auto flex-grow flex-shrink flex flex-row h-[calc(100%-2.5rem)]">
		{#if data.tables.length > 0}
			<div class="basis-auto flex-grow flex-shrink overflow-y-auto w-[10rem]">
				<Sidebar bind:currentPage={data.currentPage} data={data.tables} />
			</div>
			<div class="basis-auto w-full flex-grow flex-shrink overflow-clip">
				{#key data.currentPageTable.id}
					<Table
						on:addRow={addRow}
						on:removeRow={removeRow}
						on:addColumn={addColumn}
						on:removeColumn={removeColumn}
						on:setColumnType={setColumnType}
						on:setColumnRegexString={setColumnRegexString}
						on:setOffsetColumnAllTables={setOffsetColumnAllTables}
						on:setOffsetColumnsAllTables={setOffsetColumnsAllTables}
						on:dragX1AllTables={dragX1AllTables}
						on:dragX2AllTables={dragX2AllTables}
						data={data.currentPageTable}
						bind:scale />
				{/key}
			</div>
		{/if}
	</div>
</div>
