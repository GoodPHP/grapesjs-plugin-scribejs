/**
 * Toolbar management for grapesjs-plugin-scribejs
 */

import type { FormatState, ToolbarOptions } from './types';

/* ---- Toolbar Item Definitions ---- */

export type ToolbarItemType = 'button' | 'select' | 'color-picker';

export interface ToolbarSelectOption {
  label: string;
  value: string;
  style?: string; // e.g. font-family preview
}

export interface ToolbarItemDef {
  type: ToolbarItemType;
  name: string;
  label?: string; // accessible label or tooltip
  icon?: string; // only for buttons
  command?: string; // only for buttons
  options?: ToolbarSelectOption[]; // only for select
  colors?: string[]; // only for color-picker
  isActive?: (f: FormatState) => boolean; // for button state
  getValue?: (f: FormatState) => string; // for select value
  group?: string;
}

const DEFAULT_FONTS = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Times New Roman, serif',
  'Courier New, monospace',
  'Verdana, sans-serif',
  'Georgia, serif',
  'Palatino, serif',
  'Garamond, serif',
  'Bookman, serif',
  'Comic Sans MS, cursive'
].map(f => (typeof f === 'string' ? { label: f.split(',')[0], value: f, style: `font-family: ${f}` } : f));




const DEFAULT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
  '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
  '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
  '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
  '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79'
];

const DEFAULT_ITEMS: ToolbarItemDef[] = [
  // Block Formatting (Select)
  {
    type: 'select',
    name: 'formatBlock',
    label: 'Text Style',
    group: 'block',
    options: [
      { label: 'Paragraph', value: 'p' },
      { label: 'Heading 1', value: 'h1' },
      { label: 'Heading 2', value: 'h2' },
      { label: 'Heading 3', value: 'h3' },
      { label: 'Heading 4', value: 'h4' },
      { label: 'Heading 5', value: 'h5' },
      { label: 'Heading 6', value: 'h6' },
      { label: 'Quote', value: 'blockquote' },
    ],
    getValue: (f) => {
      if (f.heading) return `h${f.heading}`;
      if (f.blockquote) return 'blockquote';
      return 'p';
    },
  },

  // Font
  {
    type: 'select',
    name: 'fontFamily',
    label: 'Font Family', // Placeholder text
    group: 'font',
    options: DEFAULT_FONTS,
    getValue: (f) => f.fontFamily || ''
  },

  // Inline Formatting
  {
    type: 'button',
    name: 'bold',
    label: 'Bold',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>',
    command: 'bold',
    isActive: (f) => f.bold,
    group: 'inline',
  },
  {
    type: 'button',
    name: 'italic',
    label: 'Italic',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>',
    command: 'italic',
    isActive: (f) => f.italic,
    group: 'inline',
  },
  {
    type: 'button',
    name: 'underline',
    label: 'Underline',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>',
    command: 'underline',
    isActive: (f) => f.underline,
    group: 'inline',
  },
  {
    type: 'button',
    name: 'strike',
    label: 'Strike',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
    command: 'strike',
    isActive: (f) => f.strike,
    group: 'inline',
  },
  {
    type: 'color-picker',
    name: 'color',
    label: 'Text Color',
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h16"/>
      <path d="m6 16 6-11 6 11"/>
      <path d="M8 12h8"/>
      <path class="color-indicator" d="M4 21h16" stroke-width="3" style="stroke: currentColor;"/>
    </svg>`,
    command: 'setColor',
    colors: DEFAULT_COLORS,
    getValue: (f) => f.color || '',
    group: 'color',
  },
  {
    type: 'color-picker',
    name: 'backgroundColor',
    label: 'Highlight Color',
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 11-6 6v3h9l3-3"/>
      <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>
      <path class="color-indicator" d="M4 21h16" stroke-width="3" style="stroke: transparent;"/>
    </svg>`,
    command: 'setBackgroundColor',
    colors: DEFAULT_COLORS,
    getValue: (f) => f.backgroundColor || '',
    group: 'color',
  },
  {
    type: 'button',
    name: 'clearFormat',
    label: 'Clear Formatting',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h11a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1"/><path d="M11 5v14"/><path d="M7 19h8"/><line x1="2" y1="2" x2="22" y2="22"/></svg>',
    command: 'clearFormat',
    group: 'inline',
  },

  // Link
  {
    type: 'button',
    name: 'link',
    label: 'Link',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    command: 'link',
    isActive: (f) => f.link !== null,
    group: 'link',
  },

  // Alignment
  {
    type: 'button',
    name: 'alignLeft',
    label: 'Align Left',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
    command: 'alignLeft',
    isActive: (f) => f.align === 'left',
    group: 'align',
  },
  {
    type: 'button',
    name: 'alignCenter',
    label: 'Align Center',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="21" y1="6" x2="3" y2="6"/><line x1="19" y1="12" x2="5" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>',
    command: 'alignCenter',
    isActive: (f) => f.align === 'center',
    group: 'align',
  },
  {
    type: 'button',
    name: 'alignRight',
    label: 'Align Right',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>',
    command: 'alignRight',
    isActive: (f) => f.align === 'right',
    group: 'align',
  },
  {
    type: 'button',
    name: 'alignJustify',
    label: 'Justify',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    command: 'alignJustify',
    isActive: (f) => f.align === 'justify',
    group: 'align',
  },

  // List
  {
    type: 'button',
    name: 'unorderedList',
    label: 'Bullet list',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>',
    command: 'unorderedList',
    isActive: (f) => f.list === 'unordered',
    group: 'list',
  },
  {
    type: 'button',
    name: 'orderedList',
    label: 'Numbered list',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>',
    command: 'orderedList',
    isActive: (f) => f.list === 'ordered',
    group: 'list',
  },
];

/* ---- Toolbar Manager ---- */

export class ToolbarManager {
  private toolbarEl: HTMLElement | null = null;
  private items: Map<string, HTMLElement> = new Map();
  private opts: ToolbarOptions;
  // Track open popovers
  private activePopover: HTMLElement | null = null;
  // Track the currently active command executor
  private currentExecutor: ((command: string, ...args: unknown[]) => void) | null = null;
  // Track if event listeners have been bound
  private listenersAttached = false;

  constructor(opts: ToolbarOptions = {}) {
    this.opts = {
      flex: true,
      wrap: true,
      responsive: true,
      ...opts,
    };
  }

  get element(): HTMLElement | null {
    return this.toolbarEl;
  }

  /** Build the toolbar DOM and return it */
  create(doc: Document = document): HTMLElement {
    const toolbar = doc.createElement('div');
    toolbar.className = 'scribe-gjs-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Text formatting');

    this.applyBaseStyles(toolbar);

    // Build buttons
    const itemNames = this.getItemNames();
    let lastGroup: string | undefined;

    for (const item of DEFAULT_ITEMS) {
      if (itemNames && !itemNames.includes(item.name)) continue;

      // Group separators
      if (lastGroup && item.group && item.group !== lastGroup) {
        const sep = doc.createElement('span');
        sep.className = 'scribe-gjs-sep';
        sep.setAttribute('aria-hidden', 'true');
        toolbar.appendChild(sep);
      }

      const el = this.createItem(doc, item);

      // Prevent stealing focus from editor
      el.addEventListener('mousedown', (e) => {
        // Allow interactions with our custom popovers

        // If it's a regular button (not opening a popover), we want to prevent default
        // But for our custom select & color picker triggers, we also want to prevent default
        // to keep focus on editor, UNLESS we are clicking inside an input in a modal.
        // Since we are clicking the toolbar buttons themselves:
        e.preventDefault();
        // We do NOT stop propagation here usually, unless needed.
      });

      toolbar.appendChild(el);
      this.items.set(item.name, el);

      lastGroup = item.group ?? lastGroup;
    }

    this.toolbarEl = toolbar;

    // Global click listener to close popovers
    doc.addEventListener('click', (e) => {
      // If click is outside active popover and outside the toolbar element that opened it
      // actually we can just check if it's clicking inside the popover.
      if (this.activePopover && !this.activePopover.contains(e.target as Node)) {
        // Check if we clicked the toggle button for this popover?
        // The toggle logic usually handles the 'inside button' case by toggling.
        // But if we clicked 'blocks' or elsewhere, close it.
        this.closePopover();
      }
    });

    return toolbar;
  }

  private createItem(doc: Document, item: ToolbarItemDef): HTMLElement {
    if (item.type === 'select') {
      // CUSTOM SELECT IMPLEMENTATION
      const wrapper = doc.createElement('div');
      wrapper.className = 'scribe-gjs-select-wrapper';

      const btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'scribe-gjs-select-btn';
      // Initial label
      const activeLabel = item.options?.find(o => o.value === '')?.label || item.label || item.name;
      btn.innerHTML = `<span class="label">${activeLabel}</span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;

      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent global close
        this.toggleSelect(doc, wrapper, item);
      });

      wrapper.appendChild(btn);
      return wrapper;

    } else if (item.type === 'color-picker') {
      const wrapper = doc.createElement('div');
      wrapper.className = 'scribe-gjs-color-wrapper';

      const btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'scribe-gjs-btn';
      if (item.label) btn.setAttribute('aria-label', item.label);

      if (item.icon) btn.innerHTML = item.icon;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleColorPicker(doc, wrapper, item);
      });

      wrapper.appendChild(btn);
      return wrapper;

    } else {
      const btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'scribe-gjs-btn';
      if (item.command) btn.dataset.command = item.command;
      btn.dataset.name = item.name;
      if (item.label) {
        btn.title = item.label;
        btn.setAttribute('aria-label', item.label);
      }
      btn.setAttribute('aria-pressed', 'false');
      if (item.icon && item.icon.trim().startsWith('<')) {
        btn.innerHTML = item.icon;
      } else if (item.icon) {
        btn.textContent = item.icon;
      }
      return btn;
    }
  }

  private toggleSelect(doc: Document, wrapper: HTMLElement, item: ToolbarItemDef) {
    if (this.activePopover && this.activePopover.parentElement === wrapper) {
      this.closePopover();
      return;
    }
    this.closePopover();

    const dropdown = doc.createElement('div');
    dropdown.className = 'scribe-gjs-select-dropdown';
    // Position roughly

    item.options?.forEach(opt => {
      if (opt.value === '') return; // skip placeholder in list if desired, or keep it.
      // Let's skip placeholder in the dropdown list for cleaner UI? 
      // Or keep it as "Default"? The user didn't specify. 
      // User asked for "placeholder for select input... if font family was selected then show it".
      // In dropdown list usually we show options.

      const optBtn = doc.createElement('button');
      optBtn.type = 'button';
      optBtn.className = 'scribe-gjs-select-option';
      optBtn.textContent = opt.label;
      if (opt.style) optBtn.style.cssText = opt.style;

      optBtn.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent focus loss!
      });

      optBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Dispatch change
        const event = new CustomEvent('select-changed', { detail: { value: opt.value, name: item.name } });
        wrapper.dispatchEvent(event);
        this.closePopover();
      });

      // Mark active option
      const currentVal = item.getValue ? item.getValue(this.lastFormats || {}) : '';
      const normalize = (f: string) => f.toLowerCase().replace(/['"]/g, '').split(',')[0].trim();
      if (normalize(opt.value) === normalize(currentVal)) {
        optBtn.classList.add('active');
        // Scroll into view when opened (need to wait for append)
        setTimeout(() => optBtn.scrollIntoView({ block: 'nearest' }), 0);
      }

      dropdown.appendChild(optBtn);
    });

    wrapper.appendChild(dropdown);
    this.activePopover = dropdown;
  }

  private toggleColorPicker(doc: Document, wrapper: HTMLElement, item: ToolbarItemDef) {
    if (this.activePopover && this.activePopover.parentElement === wrapper) {
      this.closePopover();
      return;
    }
    this.closePopover();

    const picker = doc.createElement('div');
    picker.className = 'scribe-gjs-color-picker';

    // Default (Reset) Action
    const resetBtn = doc.createElement('div');
    resetBtn.className = 'scribe-gjs-color-reset';
    resetBtn.textContent = 'Default';

    resetBtn.addEventListener('mousedown', (e) => e.preventDefault()); // Keep focus
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const event = new CustomEvent('color-selected', { detail: { color: 'initial', command: item.command } });
      wrapper.dispatchEvent(event);
      this.closePopover();
    });
    picker.appendChild(resetBtn);

    const grid = doc.createElement('div');
    grid.className = 'scribe-gjs-color-grid';

    item.colors?.forEach(color => {
      const swatch = doc.createElement('button');
      swatch.type = 'button';
      swatch.className = 'scribe-gjs-color-swatch';
      swatch.style.backgroundColor = color;
      swatch.dataset.color = color;

      swatch.addEventListener('mousedown', (e) => e.preventDefault()); // Keep focus
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        const event = new CustomEvent('color-selected', { detail: { color, command: item.command } });
        wrapper.dispatchEvent(event);
        this.closePopover();
      });

      grid.appendChild(swatch);
    });

    picker.appendChild(grid);
    wrapper.appendChild(picker);
    this.activePopover = picker;
  }

  private closePopover() {
    if (this.activePopover) {
      this.activePopover.remove();
      this.activePopover = null;
    }
  }

  /** Attach handlers that call scribe commands */
  bindCommands(execFn: (command: string, ...args: unknown[]) => void) {
    // Update the current executor
    this.currentExecutor = execFn;

    // Only attach event listeners once
    if (this.listenersAttached) return;
    this.listenersAttached = true;

    this.items.forEach((el, name) => {
      const item = DEFAULT_ITEMS.find((b) => b.name === name);
      if (!item) return;

      if (item.type === 'select') {
        el.addEventListener('select-changed', (e: Event) => {
          if (!this.currentExecutor) return;
          const detail = (e as CustomEvent).detail;
          if (!detail || !detail.value) return;
          const val = detail.value;

          if (name === 'formatBlock') {
            if (val === 'p') this.currentExecutor('paragraph');
            else if (val === 'blockquote') this.currentExecutor('blockquote');
            else if (val.startsWith('h')) {
              const level = parseInt(val.substring(1));
              this.currentExecutor('heading', level);
            }
          } else if (name === 'fontFamily') {
            this.currentExecutor('setFontFamily', val);
          }
        });

      } else if (item.type === 'color-picker') {
        el.addEventListener('color-selected', (e: Event) => {
          if (!this.currentExecutor) return;
          const detail = (e as CustomEvent).detail;
          if (detail && detail.command) {
            let color = detail.color;
            if (color === 'initial') color = 'inherit';
            this.currentExecutor(detail.command, color);
          }
        });

      } else {
        el.addEventListener('click', () => {
          if (!this.currentExecutor || !item.command) return;

          if (item.command === 'link') {
            const modal = document.querySelector('.link-modal') as HTMLElement;
            const backdrop = document.querySelector('.link-modal-backdrop') as HTMLElement;
            const input = document.getElementById('link-url-input') as HTMLInputElement;
            const removeBtn = document.getElementById('link-remove') as HTMLButtonElement;
            const form = document.getElementById('link-form') as HTMLFormElement;

            if (modal && backdrop && input && form) {
              const rect = el.getBoundingClientRect();
              modal.style.left = `${rect.left}px`;
              modal.style.top = `${rect.bottom + 8}px`;

              modal.classList.add('visible');
              backdrop.classList.add('visible');
              input.value = '';
              input.focus();

              const close = () => {
                modal.classList.remove('visible');
                backdrop.classList.remove('visible');
              };

              const onSubmit = (e: Event) => {
                e.preventDefault();
                const url = input.value;
                if (url && this.currentExecutor) this.currentExecutor('link', url);
                close();
                form.removeEventListener('submit', onSubmit);
              };
              form.addEventListener('submit', onSubmit, { once: true });

              const onRemove = () => {
                if (this.currentExecutor) this.currentExecutor('unlink');
                close();
                removeBtn.removeEventListener('click', onRemove);
              };
              if (removeBtn) removeBtn.addEventListener('click', onRemove, { once: true });

              backdrop.onclick = close;
              document.getElementById('link-cancel')!.onclick = close;
            } else {
              const url = prompt('Enter URL:');
              if (url) this.currentExecutor('link', url);
            }

          } else {
            this.currentExecutor(item.command);
          }
        });
      }
    });
  }

  /** Update active states based on format */
  private lastFormats: FormatState | null = null;
  updateState(formats: FormatState | null) {
    if (!formats) return;
    this.lastFormats = formats;
    this.items.forEach((el, name) => {
      const item = DEFAULT_ITEMS.find((b) => b.name === name);
      if (!item) return;

      if (item.type === 'select' && item.getValue) {
        const val = item.getValue(formats);
        // Update custom select label
        const btnLabel = el.querySelector('.scribe-gjs-select-btn .label');
        if (btnLabel) {
          // Improved matching for fonts and font-sizes
          const normalize = (f: string) => f.toLowerCase().replace(/['"]/g, '').split(',')[0].trim();
          const normalizedVal = normalize(val);
          const opt = item.options?.find(o => normalize(o.value) === normalizedVal);
          btnLabel.textContent = opt ? opt.label : (val ? val.split(',')[0].replace(/['"]/g, '') : 'Font Family');
        }
      } else if (item.type === 'color-picker' && item.getValue) {
        const color = item.getValue(formats);
        const indicator = el.querySelector('.color-indicator') as HTMLElement;
        if (indicator) {
          if (color && color !== 'inherit' && color !== 'initial' && color !== 'transparent') {
            indicator.style.stroke = color;
            indicator.style.display = 'block';
          } else {
            // Default colors or transparent
            indicator.style.stroke = name === 'color' ? 'currentColor' : 'transparent';
          }
        }
      } else if (item.type === 'button' && item.isActive) {
        const active = item.isActive(formats);
        el.classList.toggle('active', active);
        el.setAttribute('aria-pressed', String(active));
      }
    });
  }

  // ... rest of class unchanged
  /** Position the toolbar near a selection rect */
  positionNear(rect: DOMRect, containerRect?: DOMRect) {
    if (!this.toolbarEl) return;

    const tb = this.toolbarEl;
    const offsetY = 8;

    // Default centering
    let left = rect.left + rect.width / 2 - tb.offsetWidth / 2;
    let top = rect.top - tb.offsetHeight - offsetY;

    if (containerRect) {
      top -= containerRect.top;
      left -= containerRect.left;

      const containerWidth = containerRect.width;
      // Clamp horizontal
      if (left < 4) left = 4;
      if (left + tb.offsetWidth > containerWidth) {
        left = containerWidth - tb.offsetWidth - 4;
      }
    } else {
      // Clamp relative to viewport
      if (left < 4) left = 4;
      if (left + tb.offsetWidth > window.innerWidth - 4) {
        left = window.innerWidth - tb.offsetWidth - 4;
      }
    }

    if (top < 4) {
      top = rect.bottom + offsetY - (containerRect?.top ?? 0);
    }

    tb.style.top = `${top}px`;
    tb.style.left = `${left}px`;
  }

  show() {
    this.toolbarEl?.classList.add('visible');
  }

  hide() {
    this.toolbarEl?.classList.remove('visible');
    this.closePopover();
  }

  destroy() {
    this.toolbarEl?.remove();
    this.items.clear();
    this.toolbarEl = null;
  }

  private getItemNames(): string[] | null {
    if (!this.opts.items || this.opts.items.length === 0) return null;
    return this.opts.items.map((i) => (typeof i === 'string' ? i : i.name));
  }

  private applyBaseStyles(el: HTMLElement) {
    // Force nowrap
    el.style.display = 'flex';
    el.style.flexWrap = 'nowrap';
    el.style.whiteSpace = 'nowrap';
  }
}

/* ---- Inject toolbar CSS and Modal HTML ---- */

export function injectToolbarStyles(doc: Document) {
  if (!doc.getElementById('scribe-gjs-toolbar-styles')) {
    const style = doc.createElement('style');
    style.id = 'scribe-gjs-toolbar-styles';
    style.textContent = TOOLBAR_CSS;
    doc.head.appendChild(style);
  }

  // Inject Link Modal if missing
  if (!doc.querySelector('.link-modal')) {
    const backdrop = doc.createElement('div');
    backdrop.className = 'link-modal-backdrop';

    const modal = doc.createElement('div');
    modal.className = 'link-modal';
    modal.innerHTML = `
        <form id="link-form">
          <div class="input-group">
            <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            <input type="text" id="link-url-input" placeholder="https://..." autocomplete="off">
          </div>
          <div class="actions">
            <div class="left">
              <button type="button" id="link-remove" class="remove" title="Remove link">
                <svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
            <div class="right">
              <button type="button" id="link-cancel" class="cancel">Cancel</button>
              <button type="submit" class="apply">Apply</button>
            </div>
          </div>
        </form>
      `;
    doc.body.appendChild(backdrop);
    doc.body.appendChild(modal);
  }
}

const TOOLBAR_CSS = `
.scribe-gjs-toolbar {
  display: none;
  position: absolute;
  transition: top 0.12s ease, left 0.12s ease;
  gap: 4px;
  padding: 8px;
  background: hsl(0 0% 100%);
  border: 1px solid hsl(214 32% 88%);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12), 0 4px 8px rgba(15, 23, 42, 0.06);
  z-index: 99999;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  
  white-space: nowrap;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
}
.scribe-gjs-toolbar.visible { display: flex; }

.scribe-gjs-btn {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: hsl(222 47% 11% / 0.8);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  flex-shrink: 0;
}
.scribe-gjs-btn:hover {
  background: hsl(210 20% 96%);
  color: hsl(222 47% 11%);
  transform: translateY(-1px);
}
.scribe-gjs-btn.active {
  background: hsl(215 100% 95%);
  color: hsl(215 80% 40%);
}
.scribe-gjs-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Custom Select */
.scribe-gjs-select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
  flex-shrink: 0;
}
.scribe-gjs-select-btn {
  all: unset;
  display: inline-flex;
  align-items: center;
  background-color: hsl(210 20% 98%);
  border: 1px solid hsl(214 32% 88%);
  border-radius: 6px;
  padding: 0 8px;
  height: 32px;
  font-size: 13px;
  font-family: inherit;
  color: hsl(222 47% 11%);
  cursor: pointer;
  font-weight: 500;
  min-width: 80px;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  gap: 6px;
}
.scribe-gjs-select-btn span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.scribe-gjs-select-btn:hover {
  border-color: hsl(214 32% 80%);
  background-color: hsl(210 20% 96%);
}
.scribe-gjs-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid hsl(214 32% 88%);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 4px;
  z-index: 100;
  min-width: 140px;
  max-height: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.scribe-gjs-select-option {
  all: unset;
  display: block;
  padding: 6px 12px;
  font-size: 13px;
  color: hsl(222 47% 11%);
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
}
.scribe-gjs-select-option:hover {
  background: hsl(210 20% 96%);
}
.scribe-gjs-select-option.active {
  background: hsl(215 100% 95%);
  color: hsl(215 80% 40%);
  font-weight: 600;
  border-left: 3px solid hsl(215 80% 40%);
  padding-left: 9px;
}

.scribe-gjs-sep {
  width: 1px;
  height: 20px;
  background: hsl(214 32% 90%);
  align-self: center;
  margin: 0 4px;
  flex-shrink: 0;
}

/* Color Picker */
.scribe-gjs-color-wrapper {
  position: relative;
  display: inline-flex;
}
.scribe-gjs-color-picker {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid hsl(214 32% 88%);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px;
  z-index: 100;
  width: 190px;
}
.scribe-gjs-color-reset {
  display: block;
  width: 100%;
  padding: 6px;
  text-align: center;
  font-size: 12px;
  color: hsl(222 47% 11%);
  background: hsl(210 20% 96%);
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 6px;
  font-weight: 500;
}
.scribe-gjs-color-reset:hover {
  background: hsl(214 32% 88%);
}
.scribe-gjs-color-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 2px;
}
.scribe-gjs-color-swatch {
  width: 16px;
  height: 16px;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 2px;
  padding: 0;
  cursor: pointer;
}
.scribe-gjs-color-swatch:hover {
  transform: scale(1.2);
  z-index: 1;
  border-color: rgba(0,0,0,0.3);
}

/* Link Modal */
.link-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99998;
    background: rgba(0,0,0,0.1);
    display: none;
}
.link-modal-backdrop.visible { display: block; }

.link-modal {
    position: fixed;
    z-index: 99999; /* Higher than toolbar */
    background: white;
    border: 1px solid hsl(214 32% 88%);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    padding: 12px;
    min-width: 300px;
    display: none;
    font-family: 'Inter', sans-serif;
}
.link-modal.visible { display: block; }
.link-modal input {
    width: 100%;
    padding: 8px;
    border: 1px solid hsl(214 32% 88%);
    border-radius: 4px;
    margin-bottom: 8px;
    font-size: 14px;
}
.link-modal .actions {
    display: flex;
    justify-content: space-between;
}
.link-modal button {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
}
.link-modal .apply {
    background: hsl(173, 80%, 40%);
    color: white;
}
.link-modal .cancel {
    background: transparent;
    color: #666;
}
.link-modal .remove {
    background: transparent;
    color: #ff4d4f;
    padding: 6px;
}
.link-modal .input-group {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
}
.link-modal .input-group svg {
    width: 16px; 
    height: 16px;
    stroke: #999;
    fill: none;
    stroke-width: 2;
}
`;
