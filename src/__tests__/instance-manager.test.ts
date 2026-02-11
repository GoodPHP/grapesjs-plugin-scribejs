import { InstanceManager } from '../instance-manager';

// Mock scribejs-editor
jest.mock('scribejs-editor', () => ({
    Scribe: {
        createEditor: jest.fn().mockImplementation((config) => ({
            destroy: jest.fn(),
            config
        })),
    }
}));

import { Scribe } from 'scribejs-editor';

describe('InstanceManager', () => {
    let manager: InstanceManager;
    let container: HTMLElement;

    beforeEach(() => {
        manager = new InstanceManager({ debug: false });
        container = document.createElement('div');
        (Scribe.createEditor as jest.Mock).mockClear();
    });

    it('should create a new instance', () => {
        const instance = manager.create(container);
        expect(instance).toBeDefined();
        expect(Scribe.createEditor).toHaveBeenCalledWith(expect.objectContaining({
            target: container
        }));
        expect(container.dataset.scribeId).toBeDefined();
    });

    it('should return existing instance if created twice', () => {
        const instance1 = manager.create(container);
        const instance2 = manager.create(container);
        expect(instance1).toBe(instance2);
        expect(Scribe.createEditor).toHaveBeenCalledTimes(1);
    });

    it('should destroy instance by element', () => {
        const instance = manager.create(container);
        const destroySpy = (instance as any).destroy;

        manager.destroyByElement(container);

        expect(destroySpy).toHaveBeenCalled();
        expect(container.dataset.scribeId).toBeUndefined();
        expect(manager.getByElement(container)).toBeUndefined();
    });

    it('should destroy all instances', () => {
        const c1 = document.createElement('div');
        const c2 = document.createElement('div');
        manager.create(c1);
        manager.create(c2);

        expect(manager.getAll().size).toBe(2);

        manager.destroyAll();

        expect(manager.getAll().size).toBe(0);
        expect(c1.dataset.scribeId).toBeUndefined();
        expect(c2.dataset.scribeId).toBeUndefined();
    });

    it('should register extra plugins', () => {
        const plugin = { name: 'test-plugin' } as any;
        manager.registerPlugin(plugin);

        manager.create(container);

        expect(Scribe.createEditor).toHaveBeenCalledWith(expect.objectContaining({
            plugins: expect.arrayContaining([plugin])
        }));
    });
});
