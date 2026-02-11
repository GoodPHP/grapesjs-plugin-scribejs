import { CustomRTE, Editor as GrapesEditor } from 'grapesjs';

export type ToolbarPosition = "left" | "center" | "right";
export type ToolbarPlacement = "canvas-body" | "canvas-overlay" | "parent-document" | "custom-container" | "shadow-dom";
export interface ToolbarGroup {
	name: string;
	items: string[];
	label?: string;
}
export interface ToolbarOptions {
	placement?: ToolbarPlacement;
	container?: HTMLElement | string | null;
	flex?: boolean;
	wrap?: boolean;
	responsive?: boolean;
	groups?: ToolbarGroup[];
	items?: (string | ToolbarItem)[];
	customRenderer?: (toolbar: HTMLElement, items: ToolbarItem[], formatState: FormatState | null) => void;
}
export interface FeatureFlags {
	tables?: boolean;
	media?: boolean;
	code?: boolean;
	collaboration?: boolean;
	variables?: boolean;
	widgets?: boolean;
}
export type OutputFormat = "html" | "json" | "both";
export interface ScribePluginOptions {
	/** Raw ScribeJS config forwarded to every editor instance */
	scribeConfig?: Partial<ScribeConfig>;
	/** Toolbar configuration */
	toolbar?: ToolbarOptions;
	/** Whether GrapesJS uses iframe canvas (auto-detected if omitted) */
	iframe?: boolean;
	/** External toolbar container (outside canvas) */
	externalToolbarContainer?: HTMLElement | string | null;
	/** Output format when syncing to GrapesJS model */
	outputFormat?: OutputFormat;
	/** Automatically initialise ScribeJS on text component double-click */
	autoInit?: boolean;
	/** Log debug info to console */
	debug?: boolean;
	/** Extra ScribeJS plugins to register */
	plugins?: ScribePlugin[];
	/** Feature flags */
	features?: FeatureFlags;
	/** Debounce ms for content sync back to GrapesJS */
	debounceMs?: number;
	/** Extend the default customRTE interface */
	customRte?: Partial<CustomRTE>;
	/** Customize toolbar element once created */
	onToolbar?: (toolbar: HTMLElement) => void;
}
export interface ManagedInstance {
	id: string;
	element: HTMLElement;
	scribe: ScribeInstance;
	cleanup: () => void;
}
export interface ScribeExtensionAPI {
	createInstance: (el: HTMLElement, config?: Partial<ScribeConfig>) => ScribeInstance;
	destroyInstance: (el: HTMLElement) => void;
	getInstance: (el: HTMLElement) => ScribeInstance | undefined;
	destroyAll: () => void;
	registerPlugin: (plugin: ScribePlugin) => void;
	getInstances: () => Map<string, ManagedInstance>;
}
export interface ScribeEvents {
	"scribe:change": {
		el: HTMLElement;
		html: string;
	};
	"scribe:focus": {
		el: HTMLElement;
	};
	"scribe:blur": {
		el: HTMLElement;
	};
	"scribe:selectionChange": {
		el: HTMLElement;
		selection: SelectionState | null;
	};
	"scribe:ready": {
		el: HTMLElement;
		instance: ScribeInstance;
	};
	"scribe:destroy": {
		el: HTMLElement;
	};
}
export declare class ToolbarManager {
	private toolbarEl;
	private items;
	private opts;
	private activePopover;
	private currentExecutor;
	private listenersAttached;
	constructor(opts?: ToolbarOptions);
	get element(): HTMLElement | null;
	/** Build the toolbar DOM and return it */
	create(doc?: Document): HTMLElement;
	private createItem;
	private toggleSelect;
	private toggleColorPicker;
	private closePopover;
	/** Attach handlers that call scribe commands */
	bindCommands(execFn: (command: string, ...args: unknown[]) => void): void;
	/** Update active states based on format */
	private lastFormats;
	updateState(formats: FormatState | null): void;
	/** Position the toolbar near a selection rect */
	positionNear(rect: DOMRect, containerRect?: DOMRect): void;
	show(): void;
	hide(): void;
	destroy(): void;
	private getItemNames;
	private applyBaseStyles;
}
export declare function injectToolbarStyles(doc: Document): void;
export declare class InstanceManager {
	private instances;
	private options;
	private extraPlugins;
	constructor(options: ScribePluginOptions);
	/** Register an additional ScribeJS plugin for all future instances */
	registerPlugin(plugin: ScribePlugin): void;
	/** Create a new ScribeJS instance on an element */
	create(el: HTMLElement, overrides?: Partial<ScribeConfig>, callbacks?: {
		onChange?: (html: string) => void;
		onFocus?: () => void;
		onBlur?: () => void;
		onSelectionChange?: (sel: unknown) => void;
	}): ScribeInstance;
	/** Destroy instance by element */
	destroyByElement(el: HTMLElement): void;
	/** Get instance by element */
	getByElement(el: HTMLElement): ScribeInstance | undefined;
	/** Destroy all instances */
	destroyAll(): void;
	/** Expose the map */
	getAll(): Map<string, ManagedInstance>;
	get size(): number;
}
export default function grapesjsScribePlugin(editor: GrapesEditor, opts?: Partial<ScribePluginOptions>): void;

export {};
