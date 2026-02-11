/**
 * grapesjs-plugin-scribejs — Type Definitions
 * Full configuration & extension API for the GrapesJS ↔ ScribeJS integration.
 */

import type {
  EditorInstance as ScribeInstance,
  EditorConfig as ScribeConfig,
  Plugin as ScribePlugin,
  FormatState,
  SelectionState,
  ToolbarItem,
} from 'scribejs-editor';
import type { CustomRTE } from 'grapesjs';

// Re-export ScribeJS types for consumers
export type { ScribeInstance, ScribeConfig, ScribePlugin, FormatState, SelectionState, ToolbarItem };

/* ------------------------------------------------------------------ */
/*  Toolbar                                                            */
/* ------------------------------------------------------------------ */

export type ToolbarPosition = 'left' | 'center' | 'right';

export type ToolbarPlacement =
  | 'canvas-body'
  | 'canvas-overlay'
  | 'parent-document'
  | 'custom-container'
  | 'shadow-dom';

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
  customRenderer?: (
    toolbar: HTMLElement,
    items: ToolbarItem[],
    formatState: FormatState | null,
  ) => void;
}

/* ------------------------------------------------------------------ */
/*  Feature flags                                                      */
/* ------------------------------------------------------------------ */

export interface FeatureFlags {
  tables?: boolean;
  media?: boolean;
  code?: boolean;
  collaboration?: boolean;
  variables?: boolean;
  widgets?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Plugin options (passed to grapesjsScribePlugin)                    */
/* ------------------------------------------------------------------ */

export type OutputFormat = 'html' | 'json' | 'both';

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

/* ------------------------------------------------------------------ */
/*  Instance manager — stored per text-component                       */
/* ------------------------------------------------------------------ */

export interface ManagedInstance {
  id: string;
  element: HTMLElement;
  scribe: ScribeInstance;
  cleanup: () => void;
}

/* ------------------------------------------------------------------ */
/*  Developer extension API exposed on editor.ScribeJS                */
/* ------------------------------------------------------------------ */

export interface ScribeExtensionAPI {
  createInstance: (el: HTMLElement, config?: Partial<ScribeConfig>) => ScribeInstance;
  destroyInstance: (el: HTMLElement) => void;
  getInstance: (el: HTMLElement) => ScribeInstance | undefined;
  destroyAll: () => void;
  registerPlugin: (plugin: ScribePlugin) => void;
  getInstances: () => Map<string, ManagedInstance>;
}

/* ------------------------------------------------------------------ */
/*  Events emitted on GrapesJS editor                                  */
/* ------------------------------------------------------------------ */

export interface ScribeEvents {
  'scribe:change': { el: HTMLElement; html: string };
  'scribe:focus': { el: HTMLElement };
  'scribe:blur': { el: HTMLElement };
  'scribe:selectionChange': { el: HTMLElement; selection: SelectionState | null };
  'scribe:ready': { el: HTMLElement; instance: ScribeInstance };
  'scribe:destroy': { el: HTMLElement };
}
