/**
 * grapesjs-plugin-scribejs
 *
 * A production-ready GrapesJS plugin that replaces the built-in Rich Text
 * Editor with ScribeJS — exposing full formatting, toolbar, iframe and
 * extension APIs.
 *
 * Usage:
 *   import grapesjsScribePlugin from '@/lib/grapesjs-plugin-scribejs';
 *   const editor = grapesjs.init({
 *     plugins: [grapesjsScribePlugin],
 *     pluginsOpts: { [grapesjsScribePlugin as any]: { position: 'left' } }
 *   });
 */

import type { Editor as GrapesEditor } from 'grapesjs';
import type { EditorInstance as ScribeInstance, SelectionState } from 'scribejs-editor';
import { InstanceManager } from './instance-manager';
import { ToolbarManager, injectToolbarStyles } from './toolbar';
import type { ScribePluginOptions, ScribeExtensionAPI } from './types';

// Re-export everything for external consumers
export * from './types';
export { ToolbarManager, injectToolbarStyles } from './toolbar';
export { InstanceManager } from './instance-manager';

/**
 * Injects base styles for heading elements into the provided document head.
 * This prevents default browser margins/padding from interfering with the editor layout.
 */
function injectEditorStyles(doc: Document) {
  const styleId = 'scribe-gjs-editor-styles';
  if (doc.getElementById(styleId)) return;

  const style = doc.createElement('style');
  style.id = styleId;
  style.textContent = `
    h1, h2, h3, h4, h5, h6 {
      margin: 0 !important;
      padding: 0 !important;
    }
  `;
  doc.head.appendChild(style);
}

/* ------------------------------------------------------------------ */
/*  Default options                                                    */
/* ------------------------------------------------------------------ */

const DEFAULTS: ScribePluginOptions = {
  scribeConfig: {},
  toolbar: {},
  iframe: undefined, // auto-detect
  externalToolbarContainer: null,
  outputFormat: 'json',
  autoInit: true,
  debug: false,
  plugins: [],
  features: { tables: true, media: true, code: true, collaboration: false },
  debounceMs: 100,
};

/* ------------------------------------------------------------------ */
/*  Plugin entry point                                                 */
/* ------------------------------------------------------------------ */

export default function grapesjsScribePlugin(
  editor: GrapesEditor,
  opts: Partial<ScribePluginOptions> = {},
) {
  const options: ScribePluginOptions = { ...DEFAULTS, ...opts };
  const manager = new InstanceManager(options);
  let toolbarMgr: ToolbarManager | null = null;
  let currentRte: ScribeInstance | null = null;
  let externalToolbarEl: HTMLElement | null = null;

  /* ---- Toolbar setup ---- */

  function ensureToolbar(doc: Document): ToolbarManager {
    if (toolbarMgr) return toolbarMgr;

    toolbarMgr = new ToolbarManager(options.toolbar);
    externalToolbarEl = resolveContainer(options.externalToolbarContainer);
    const host = externalToolbarEl ?? editor.RichTextEditor.getToolbarEl() ?? doc.body;
    const hostDoc = host?.ownerDocument ?? doc;
    const el = toolbarMgr.create(hostDoc);

    // Determine where to mount
    if (externalToolbarEl) {
      injectToolbarStyles(document);
      externalToolbarEl.appendChild(el);
    } else {
      injectToolbarStyles(hostDoc);
      host.appendChild(el);
    }

    return toolbarMgr;
  }

  function resolveContainer(target: HTMLElement | string | null | undefined): HTMLElement | null {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    return target;
  }

  /* ---- Debounce helper ---- */

  function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    }) as unknown as T;
  }

  const updateToolbarPosition = () => setTimeout(() => editor.refresh(), 0);

  /* ---- Custom RTE interface ---- */

  /* ---- Custom RTE interface ---- */

  editor.setCustomRte({
    parseContent: false,

    enable(el: HTMLElement, rte: ScribeInstance | undefined) {
      const doc = el.ownerDocument;
      let lastSelectionRange: Range | null = null;

      const captureSelectionRange = () => {
        const selection = doc.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        const anchorNode = selection.anchorNode;
        const focusNode = selection.focusNode;
        if (!anchorNode || !focusNode) return;
        if (!el.contains(anchorNode) || !el.contains(focusNode)) return;
        lastSelectionRange = range.cloneRange();
      };

      const restoreSelectionRange = () => {
        if (!lastSelectionRange) return;
        const selection = doc.getSelection();
        if (!selection) return;
        // Only restore if focus was actually lost to something else
        if (doc.activeElement !== el) {
          selection.removeAllRanges();
          selection.addRange(lastSelectionRange);
        }
      };

      // Build toolbar in the same document as the GrapesJS RTE toolbar
      const tb = ensureToolbar(doc);
      injectEditorStyles(doc);

      if (rte) {
        // Re-use existing instance
        currentRte = rte;

        // Bind toolbar buttons to this scribe instance
        tb.bindCommands((command: string, ...args: unknown[]) => {
          if (!rte) return;

          try {
            const method = (rte as any)[command];
            if (typeof method === 'function') {
              method.apply(rte, args);
              // After applying formatting, we want to capture the updated selection
              // and refresh the toolbar state immediately.
              captureSelectionRange();
              tb.updateState(rte.getSelection()?.formats || null);
            }
          } finally {
            // No longer needed
          }
        });

        rte.focus();
        tb.show();
        updateToolbarPosition();
        return rte;
      }

      // Create new ScribeJS instance
      const scribe = manager.create(el, {}, {
        onFocus: () => {
          tb.show();
          updateToolbarPosition();
          editor.trigger('scribe:focus', { el });
        },
        onBlur: () => {
          // Small delay to allow toolbar clicks
          setTimeout(() => {
            if (!el.contains(doc.activeElement)) {
              // tb.hide(); // Let disable() handle cleanup
            }
          }, 150);
        },
        onSelectionChange: (sel) => {
          const selection = sel as SelectionState | null;
          if (selection) {
            tb.updateState(selection.formats);
            captureSelectionRange();
          }
          if (selection && selection.rect) {
            tb.show();
            updateToolbarPosition();
          }
          editor.trigger('scribe:selectionChange', { el, selection: sel as SelectionState | null });
        },
      });

      // Bind toolbar buttons to scribe methods
      tb.bindCommands((command: string, ...args: unknown[]) => {
        if (!scribe) return;

        try {
          const method = (scribe as any)[command];
          if (typeof method === 'function') {
            method.apply(scribe, args);
            // After applying formatting, we want to capture the updated selection
            // and refresh the toolbar state immediately.
            captureSelectionRange();
            tb.updateState(scribe.getSelection()?.formats || null);
          }
        } finally {
          // No longer needed
        }
      });

      currentRte = scribe;
      scribe.focus();
      tb.show();
      updateToolbarPosition();

      if (options.onToolbar && externalToolbarEl) {
        options.onToolbar(externalToolbarEl);
      }

      editor.trigger('scribe:ready', { el, instance: scribe });

      if (options.debug) {
        console.log('[ScribeJS Plugin] Enabled on element', el);
      }

      return scribe;
    },

    disable(el: HTMLElement, _rte: ScribeInstance) {
      toolbarMgr?.hide();
      currentRte = null;

      if (options.debug) {
        console.log('[ScribeJS Plugin] Disabled on element', el);
      }
    },

    getContent(el: HTMLElement, rte: ScribeInstance | undefined) {
      if (rte) return rte.getHTML();
      return el.innerHTML;
    },

    ...options.customRte,
  });

  /* ---- Cleanup on editor destroy ---- */

  editor.on('destroy', () => {
    manager.destroyAll();
    toolbarMgr?.destroy();
    toolbarMgr = null;
    currentRte = null;
    externalToolbarEl = null;
  });

  /* ---- Toolbar positioning ---- */
  editor.on('rteToolbarPosUpdate', (pos: any) => {
    const { elRect, targetHeight, canvasRect } = pos;
    const padding = 10;
    const canvasTop = canvasRect?.top ?? 0;
    const canvasBottom = canvasRect?.bottom ?? window.innerHeight;

    // Check if there is enough space above the element
    // We use elRect.top (viewport-relative) - canvasTop (viewport-relative) to check space within canvas
    if ((elRect.top - canvasTop) > (targetHeight + padding + 40)) {
      pos.top = -60;
      pos.bottom = '';
    } else {
      pos.top = '';
      pos.bottom = -6;
    }

    // Always align toolbar to the left
    pos.left = 0;
    pos.right = '';
  });

  // Update toolbar on scroll
  editor.on('canvasScroll', () => {
    updateToolbarPosition();
  });

  /* ---- Extension API ---- */

  const extensionAPI: ScribeExtensionAPI = {
    createInstance: (el, config) => manager.create(el, config),
    destroyInstance: (el) => manager.destroyByElement(el),
    getInstance: (el) => manager.getByElement(el),
    destroyAll: () => manager.destroyAll(),
    registerPlugin: (plugin) => manager.registerPlugin(plugin),
    getInstances: () => manager.getAll(),
  };

  (editor as any).ScribeJS = extensionAPI;

  if (options.debug) {
    console.log('[ScribeJS Plugin] Initialised with options', options);
  }
}
