import { ToolbarManager } from '../toolbar';

describe('ToolbarManager', () => {
    let manager: ToolbarManager;

    beforeEach(() => {
        manager = new ToolbarManager();
        // Mock getBoundingClientRect for position tests
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
            width: 100, height: 100, top: 0, left: 0, bottom: 100, right: 100, x: 0, y: 0, toJSON: () => { }
        }));
    });

    it('should create toolbar element', () => {
        const el = manager.create();
        expect(el).toBeDefined();
        expect(el.classList.contains('scribe-gjs-toolbar')).toBe(true);
        expect(manager.element).toBe(el);
    });

    it('should render default items', () => {
        const el = manager.create();
        const buttons = el.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(0);
    });

    it('should bind commands and execute callback', () => {
        const el = manager.create();
        const execSpy = jest.fn();
        manager.bindCommands(execSpy);

        // Find bold button (assumed name='bold')
        const boldBtn = el.querySelector('button[data-name="bold"]') as HTMLElement;
        expect(boldBtn).toBeDefined();

        boldBtn.click();
        expect(execSpy).toHaveBeenCalledWith('bold');
    });

    it('should update active state', () => {
        const el = manager.create();
        const boldBtn = el.querySelector('button[data-name="bold"]') as HTMLElement;

        manager.updateState({ bold: true } as any);
        expect(boldBtn.classList.contains('active')).toBe(true);

        manager.updateState({ bold: false } as any);
        expect(boldBtn.classList.contains('active')).toBe(false);
    });

    it('should toggle visibility', () => {
        const el = manager.create();
        manager.show();
        expect(el.classList.contains('visible')).toBe(true);

        manager.hide();
        expect(el.classList.contains('visible')).toBe(false);
    });

    it('should clean up on destroy', () => {
        const el = manager.create();
        document.body.appendChild(el);

        manager.destroy();

        expect(document.body.contains(el)).toBe(false);
        expect(manager.element).toBeNull();
    });
});
