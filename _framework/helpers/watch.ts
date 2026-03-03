import { watch, WatchOptions, FSWatcher } from "chokidar";

/**
 * @typedef Status
 * @type { "created" | "renamed" | "edited" | "deleted" }
 */

/**
 * @param { string } dir
 * @param { import("chokidar").WatchOptions } [options]
 * @returns { Object }
 * @property { FSWatcher } fsWatcher
 * @property { (path: string, stats?: import('fs').Stats) => void } onCreateFile
 * @property { (path: string, stats?: import('fs').Stats) => void } onCreateDir
 * @property { (path: string, stats?: import('fs').Stats) => void } onEdit
 * @property { (path: string) => void } onDelete
 */

export default ((dir, options = {}) => {
	const fsWatcher = watch(dir, { persistent: true, ignoreInitial: true, ...options, alwaysStat: true });

	return {
		fsWatcher,

		onCreateFile: oncreate => fsWatcher.on("add", (path, stats) => oncreate(path, stats)),
		onCreateDir: oncreate => fsWatcher.on("addDir", (path, stats) => oncreate(path, stats)),

		onEdit: onedit => fsWatcher.on("change", (path, stats) => onedit(path, stats)),

		onDelete: ondelete => fsWatcher.on("unlink", path => ondelete(path)),
	};
}) satisfies Watch;

type Watch = (
	dir: string,
	options?: WatchOptions,
) => {
	fsWatcher: FSWatcher;
	onCreateFile: (oncreate: (path: string, stats?: import("fs").Stats) => void) => void;
	onCreateDir: (oncreate: (path: string, stats?: import("fs").Stats) => void) => void;
	onEdit: (onedit: (path: string, stats?: import("fs").Stats) => void) => void;
	onDelete: (ondelete: (path: string) => void) => void;
};
