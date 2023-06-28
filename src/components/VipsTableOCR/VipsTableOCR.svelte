<script lang="ts">
	import { onMount } from 'svelte';
	import { type OCRInterface, TableData, TablesData } from './index';
	import Table from './Table.svelte';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';
	import { goto } from '$app/navigation';

	export let documentData;
	let data: TablesData = new TablesData();
	let scale = 1;
	let columnTemplateData = null;
	let columnTemplatesData = [];

	function sendAllData() {
		let mergedCells = [];
		for (const table of data.tables) {
			const columns = table.columns
				.filter((column) => column.name !== null)
				.sort((a, b) => a.x1 - b.x1);
			const rows = table.rows.sort((a, b) => a.y1 - b.y1);
			const cells = [];
			for (const column of columns) {
				for (const rowNumber in rows) {
					const row = rows[rowNumber];
					cells.push({
						colName: column.name,
						rowNumber,
						x1: column.x1,
						x2: column.x2,
						y1: row.y1,
						y2: row.y2,
						text: []
					});
				}
			}
			for (const cell of cells) {
				cell.text = table.ocr.filter((ocr) => {
					return (
						ocr.x1 - table.tableCrop.x1 >= cell.x1 &&
						ocr.x2 - table.tableCrop.x1 <= cell.x2 &&
						ocr.y1 - table.tableCrop.y1 >= cell.y1 &&
						ocr.y2 - table.tableCrop.y1 <= cell.y2
					);
				});
				cell.text.sort((a, b) => a.x1 - b.x1);
				cell.text.sort((a, b) => a.y1 - b.y1);
			}
			localStorage.setItem(table.id + 'columns', JSON.stringify(table.columns));
			localStorage.setItem(table.id + 'rows', JSON.stringify(table.rows));
			mergedCells = mergedCells.concat(cells);
		}

		localStorage.setItem(
			documentData.id,
			JSON.stringify(
				mergedCells.map((cell) => {
					return {
						colName: cell.colName,
						rowNumber: cell.rowNumber,
						text: cell.text.map((text) => text.text).join(' '),
						x1: cell.x1,
						x2: cell.x2,
						y1: cell.y1,
						y2: cell.y2
					};
				})
			)
		);

		goto('/' + documentData.id + '/dokument');
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

	function renameColumn(event) {
		data.renameColumn(event.detail.id, event.detail.newName);
		data = data;
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
		const res = await fetch('http://192.168.10.20:8000/api/column_templates', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		columnTemplatesData = await res.json();
	}

	async function postColumnTemplate(event) {
		const res = await fetch('http://192.168.10.20:8000/api/column_templates', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				naziv: event.detail,
				stupci: data.currentPageTable?.columns.map((column) => {
					return {
						x1: column.x1,
						x2: column.x2,
						naziv: column.name
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
				data.AddColumnsAllTables({
					id: event.detail[i].id,
					name: event.detail[i].naziv,
					x1: event.detail[i].x1,
					x2: event.detail[i].x2
				});
			}
		} else {
			data.currentPageTable.columns = [];
			for (let i = 0; i < event.detail.length; i++) {
				data.currentPageTable.addColumn({
					id: event.detail[i].id,
					name: event.detail[i].naziv,
					x1: event.detail[i].x1,
					x2: event.detail[i].x2
				});
			}
		}

		data = data;
	}

	onMount(async () => {
		for (let i = 0; i < documentData['stranice'].length; i++) {
			const columns = documentData['stranice'][0]['tablica']['definicija'].columns.map(
				(column, index) => {
					return {
						id: index,
						name: null,
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
					tableCrop: crop
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
			on:postColumnTemplate={postColumnTemplate}
			on:getColumnTemplates={getColumnTemplates}
			on:toggleUnlink={(event) => (data.currentPageTable.isUnlinked = event.detail)}
			on:sendAllData={sendAllData}
		/>
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
						on:renameColumn={renameColumn}
						on:setOffsetColumnAllTables={setOffsetColumnAllTables}
						on:setOffsetColumnsAllTables={setOffsetColumnsAllTables}
						on:dragX1AllTables={dragX1AllTables}
						on:dragX2AllTables={dragX2AllTables}
						data={data.currentPageTable}
						bind:scale
					/>
				{/key}
			</div>
		{/if}
	</div>
</div>
