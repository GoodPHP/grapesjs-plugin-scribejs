import grapesjsScribePlugin from '../index';

// Mock dependencies
jest.mock('scribejs-editor', () => ({
    EditorInstance: jest.fn(),
    SelectionState: jest.fn(),
}));

describe('grapesjs-plugin-scribejs', () => {
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
        // Mock document methods if needed
        document.body.innerHTML = '<div id="gjs"></div>';
    });

    it('should initialize the plugin', () => {
        grapesjsScribePlugin(editor);

        expect(editor.setCustomRte).toHaveBeenCalled();
        expect(editor.on).toHaveBeenCalledWith('destroy', expect.any(Function));
        expect(editor.on).toHaveBeenCalledWith('rteToolbarPosUpdate', expect.any(Function));
        expect(editor.on).toHaveBeenCalledWith('canvasScroll', expect.any(Function));
    });

    it('should register extension API', () => {
        grapesjsScribePlugin(editor);
        expect(editor.ScribeJS).toBeDefined();
        expect(editor.ScribeJS.createInstance).toBeDefined();
    });
});
