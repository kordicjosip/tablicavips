export { default as ContextMenu } from '../../components/ContextMenu/ContextMenu.svelte';

export class ContextMenuEntry {
	title: string;
	icon: string;
	action: Function;

	constructor(title: string, icon: string, action: Function) {
		this.title = title;
		this.icon = icon;
		this.action = action;
	}
}

export class ContextMenuGroup {
	title: string;
	entries: ContextMenuEntry[] = [];

	constructor(title: string) {
		this.title = title;
	}
}

export class ContextMenuDefinition {
	groups: ContextMenuGroup[] = [];
}
