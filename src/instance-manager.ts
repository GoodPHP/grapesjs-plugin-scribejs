/**
 * Manages ScribeJS editor instances — create, cache, destroy.
 */

import { Scribe } from 'scribejs-editor';
import type { EditorConfig as ScribeConfig, EditorInstance as ScribeInstance, Plugin as ScribePlugin } from 'scribejs-editor';
import type { ManagedInstance, ScribePluginOptions } from './types';

let counter = 0;

export class InstanceManager {
  private instances = new Map<string, ManagedInstance>();
  private options: ScribePluginOptions;
  private extraPlugins: ScribePlugin[] = [];

  constructor(options: ScribePluginOptions) {
    this.options = options;
    if (options.plugins) {
      this.extraPlugins.push(...options.plugins);
    }
  }

  /** Register an additional ScribeJS plugin for all future instances */
  registerPlugin(plugin: ScribePlugin) {
    this.extraPlugins.push(plugin);
  }

  /** Create a new ScribeJS instance on an element */
  create(
    el: HTMLElement,
    overrides: Partial<ScribeConfig> = {},
    callbacks?: {
      onChange?: (html: string) => void;
      onFocus?: () => void;
      onBlur?: () => void;
      onSelectionChange?: (sel: unknown) => void;
    },
  ): ScribeInstance {
    // Re-use existing
    const existing = this.getByElement(el);
    if (existing) return existing;

    const id = `scribe-gjs-${++counter}`;
    el.dataset.scribeId = id;

    const config: Partial<ScribeConfig> = {
      ...this.options.scribeConfig,
      ...overrides,
      plugins: [...(this.options.scribeConfig?.plugins ?? []), ...this.extraPlugins],
      onChange: (html: string) => {
        callbacks?.onChange?.(html);
        this.options.scribeConfig?.onChange?.(html);
      },
      onFocus: () => {
        callbacks?.onFocus?.();
        this.options.scribeConfig?.onFocus?.();
      },
      onBlur: () => {
        callbacks?.onBlur?.();
        this.options.scribeConfig?.onBlur?.();
      },
      onSelectionChange: (sel) => {
        if (this.options.debug) {
          console.log('[ScribeJS Debug] Selection changed:', sel);
        }
        callbacks?.onSelectionChange?.(sel);
        this.options.scribeConfig?.onSelectionChange?.(sel as any);
      },
    };

    const scribe = Scribe.createEditor({
      target: el,
      ...config,
    } as ScribeConfig);

    const cleanup = () => {
      scribe.destroy();
      this.instances.delete(id);
      delete el.dataset.scribeId;
    };

    this.instances.set(id, { id, element: el, scribe, cleanup });

    if (this.options.debug) {
      console.log(`[ScribeJS Plugin] Created instance ${id}`);
    }

    return scribe;
  }

  /** Destroy instance by element */
  destroyByElement(el: HTMLElement) {
    const id = el.dataset.scribeId;
    if (!id) return;
    const inst = this.instances.get(id);
    inst?.cleanup();
  }

  /** Get instance by element */
  getByElement(el: HTMLElement): ScribeInstance | undefined {
    const id = el.dataset.scribeId;
    if (!id) return undefined;
    return this.instances.get(id)?.scribe;
  }

  /** Destroy all instances */
  destroyAll() {
    this.instances.forEach((inst) => inst.cleanup());
    this.instances.clear();
  }

  /** Expose the map */
  getAll(): Map<string, ManagedInstance> {
    return this.instances;
  }

  get size(): number {
    return this.instances.size;
  }
}
