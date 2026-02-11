import grapesjsScribePlugin from '../index';
import { InstanceManager } from '../instance-manager';
import { ToolbarManager } from '../toolbar';

// Mock dependencies
jest.mock('scribejs-editor', () => ({
    EditorInstance: jest.fn(),
    SelectionState: jest.fn(),
}));

jest.mock('../instance-manager', () => ({
    InstanceManager: jest.fn().mockImplementation(() => ({
        create: jest.fn().mockReturnValue({
            focus: jest.fn(),
            getSelection: jest.fn(),
            getHTML: jest.fn(),
        }),
        destroyAll: jest.fn(),
        getByElement: jest.fn(),
        destroyByElement: jest.fn(),
        registerPlugin: jest.fn(),
        getAll: jest.fn(),
    })),
}));

jest.mock('../toolbar', () => ({
    ToolbarManager: jest.fn().mockImplementation(() => ({
        create: jest.fn().mockReturnValue(document.createElement('div')),
        bindCommands: jest.fn(),
        updateState: jest.fn(),
        show: jest.fn(),
        hide: jest.fn(),
        destroy: jest.fn(),
    })),
    injectToolbarStyles: jest.fn(),
}));

describe('grapesjs-plugin-scribejs options', () => {
    let editor: any;

    beforeEach(() => {
        editor = {
            setCustomRte: jest.fn(),
            on: jest.fn(),
            trigger: jest.fn(),
            refresh: jest.fn(),
            RichTextEditor: {
                getToolbarEl: jest.fn(),
            },
        };
        document.body.innerHTML = '<div id="gjs"></div>';
        (InstanceManager as any).mockClear();
        (ToolbarManager as any).mockClear();
    });

    it('should pass scribeConfig to InstanceManager', () => {
        const options = {
            scribeConfig: { placeholder: 'Test Placeholder' }
        };
        grapesjsScribePlugin(editor, options);
        expect(InstanceManager).toHaveBeenCalledWith(expect.objectContaining({
            scribeConfig: { placeholder: 'Test Placeholder' }
        }));
    });

    it('should pass debug option', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const options = { debug: true };
        grapesjsScribePlugin(editor, options);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[ScribeJS Plugin]'), expect.anything());
        consoleSpy.mockRestore();
    });

    it('should pass toolbar configuration', () => {
        const options = {
            toolbar: { theme: 'dark' }
        };
        grapesjsScribePlugin(editor, options as any);

        // Trigger enable to ensure toolbar is created
        const rte = (editor.setCustomRte as jest.Mock).mock.calls[0][0];
        const el = document.createElement('div');
        rte.enable(el);

        expect(ToolbarManager).toHaveBeenCalledWith({ theme: 'dark' });
    });

    it('should handle onToolbar callback', () => {
        const onToolbar = jest.fn();
        const externalContainer = document.createElement('div');
        externalContainer.id = 'ext-toolbar';
        document.body.appendChild(externalContainer);

        const options = {
            externalToolbarContainer: '#ext-toolbar',
            onToolbar
        };

        grapesjsScribePlugin(editor, options);

        const rte = (editor.setCustomRte as jest.Mock).mock.calls[0][0];
        const el = document.createElement('div');
        rte.enable(el);

        expect(onToolbar).toHaveBeenCalled();
    });

    it('should pass features and plugins', () => {
        const options = {
            features: { tables: true, media: false },
            plugins: [{ name: 'test-plugin' } as any]
        };
        grapesjsScribePlugin(editor, options);
        expect(InstanceManager).toHaveBeenCalledWith(expect.objectContaining({
            features: { tables: true, media: false },
            plugins: [{ name: 'test-plugin' }]
        }));
    });

    it('should respect autoInit option', () => {
        const options = { autoInit: false };
        grapesjsScribePlugin(editor, options);
        expect(InstanceManager).toHaveBeenCalledWith(expect.objectContaining({
            autoInit: false
        }));
    });

    it('should extend customRte interface', () => {
        const customEnable = jest.fn();
        const options = {
            customRte: {
                enable: customEnable
            }
        };
        grapesjsScribePlugin(editor, options);

        const rte = (editor.setCustomRte as jest.Mock).mock.calls[0][0];
        // Since we are spreading options.customRte at the end, it might override the default enable. 
        // Wait, looking at index.ts, it spreads ...options.customRte at the end.
        // So it should override the default enable if provided.
        // Let's check if the passed object has the custom method.
        expect(rte.enable).toBe(customEnable);
    });
});

