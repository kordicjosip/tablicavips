<script lang="ts">
	import { onMount } from 'svelte';
	import { TableData, TablesData } from './index';
	import Table from './Table.svelte';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

	let res;
	let data: TablesData = new TablesData();
	let scale = 1;
	let columnTemplateData = null;
	let columnTemplatesData = [];

	onMount(async () => {
		res = await (await fetch('/data.json')).json();
		for (let i = 0; i < res.length; i++) {
			const columns = res[0].columns.map((column, index) => {
				return {
					id: index,
					name: 'column',
					x1: column[0],
					x2: column[1],
					get width() {
						return this.x2 - this.x1;
					}
				};
			});
			const rows = res[i].rows.map((row, index) => {
				return {
					id: index,
					name: 'row',
					y1: row[0],
					y2: row[1]
				};
			});

			data.addTable(
				new TableData({
					columns: columns,
					rows: rows,
					resolution: res[i].resolution,
					image: res[i].image
				})
			);
		}
		data = data;
		await getColumnTemplates();
	});

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

	async function getColumnTemplates() {
		const res = await fetch('http://192.168.10.20:8000/api/column_templates', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		columnTemplatesData = await res.json();
	}

	function changeColumnTemplate(event) {
		console.log(event.detail);
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
</script>

<div class="h-full w-full flex flex-col">
	<div class="h-[2.5rem]">
		<Navbar
			bind:columnTemplatesData
			bind:currentPage={data.currentPage}
			bind:numberOfPages={data.tables.length}
			bind:scale
			isUnlinked={data.currentPageTable?.isUnlinked}
			on:changeColumnTemplate={changeColumnTemplate}
			on:postColumnTemplate={postColumnTemplate}
			on:toggleUnlink={(event) => (data.currentPageTable.isUnlinked = event.detail)}
		/>
	</div>
	<div class="basis-auto flex-grow flex-shrink flex flex-row h-[calc(100%-2.5rem)]">
		{#if data.tables.length > 0}
			<div class="basis-auto flex-grow flex-shrink overflow-y-auto w-[10rem]">
				<Sidebar bind:currentPage={data.currentPage} data={data.tables} />
			</div>
			<div class="basis-auto w-full flex-grow flex-shrink overflow-clip">
				{#key data.tables}
					<Table
						on:addRow={addRow}
						on:removeRow={removeRow}
						on:addColumn={addColumn}
						on:removeColumn={removeColumn}
						on:renameColumn={renameColumn}
						on:setOffsetColumnAllTables={setOffsetColumnAllTables}
						on:setOffsetColumnsAllTables={setOffsetColumnsAllTables}
						data={data.currentPageTable}
						bind:scale
					/>
				{/key}
			</div>
		{/if}
	</div>
</div>
