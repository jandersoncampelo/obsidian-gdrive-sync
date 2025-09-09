import { FileSystemAdapter } from "obsidian";

export interface SyncMeta {
	[key: string]: unknown;
}

export default class SyncState {
	private adapter: FileSystemAdapter;
	private filePath = ".gdrive-sync-state.json";
	private state: Record<string, SyncMeta> = {};

	constructor(adapter: FileSystemAdapter) {
		this.adapter = adapter;
	}

	async load(): Promise<void> {
		try {
			if (await this.adapter.exists(this.filePath)) {
				const data = await this.adapter.read(this.filePath);
				this.state = JSON.parse(data);
			} else {
				this.state = {};
			}
		} catch (err) {
			console.error("Failed to load sync state", err);
			this.state = {};
		}
	}

	async persist(): Promise<void> {
		try {
			await this.adapter.write(
				this.filePath,
				JSON.stringify(this.state, null, 2)
			);
		} catch (err) {
			console.error("Failed to persist sync state", err);
		}
	}

	get(path: string): SyncMeta | undefined {
		return this.state[path];
	}

	set(path: string, meta: SyncMeta): void {
		this.state[path] = meta;
	}

	delete(path: string): void {
		delete this.state[path];
	}
}
