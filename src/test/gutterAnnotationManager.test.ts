import * as assert from 'assert';
import { GutterAnnotationManager, GutterAnnotationConfig } from '../gutterAnnotationManager';
import { BlameInfo } from '../blameProvider';

suite('GutterAnnotationManager Test Suite', () => {
    let manager: GutterAnnotationManager;
    let config: GutterAnnotationConfig;

    setup(() => {
        config = {
            enabled: true,
            authorFormat: 'initials',
        };
        manager = new GutterAnnotationManager(config, null);
    });

    teardown(() => {
        manager.dispose();
    });

    const sampleInfo: BlameInfo = {
        hash: 'abcdef123456',
        author: 'John Doe',
        authorEmail: 'john@example.com',
        authorShort: 'John',
        date: '2023-01-01',
        message: 'Initial commit',
        lineNumber: 1
    };

    test('formatAnnotation - initials', () => {
        // Initials are short; should be padded to GUTTER_WIDTH (12)
        assert.strictEqual((manager as any).formatAnnotation(sampleInfo), 'JD          ');
    });

    test('formatAnnotation - fullName within width', () => {
        config.authorFormat = 'fullName';
        manager.updateConfig(config);
        // 'John Doe' is 8 chars, padded to 12
        assert.strictEqual((manager as any).formatAnnotation(sampleInfo), 'John Doe    ');
    });

    test('formatAnnotation - fullName truncated', () => {
        config.authorFormat = 'fullName';
        manager.updateConfig(config);
        const longName: typeof sampleInfo = { ...sampleInfo, author: 'Alessandro Verdi' };
        // 16 chars > 12, truncated to 11 + ellipsis
        assert.strictEqual((manager as any).formatAnnotation(longName), 'Alessandro V…');
    });

    test('formatAnnotation - email truncated', () => {
        config.authorFormat = 'email';
        manager.updateConfig(config);
        // 'john@example.com' is 16 chars > 12
        assert.strictEqual((manager as any).formatAnnotation(sampleInfo), 'john@example…');
    });

    class MockEditor {
        public setDecorationsCalls: Array<{ type: unknown; ranges: unknown }> = [];
        public document = {
            uri: {
                fsPath: '/path/to/file.txt',
            },
        };

        // Simulate the VS Code TextEditor#setDecorations API
        public setDecorations(type: unknown, ranges: unknown): void {
            this.setDecorationsCalls.push({ type, ranges });
        }
    }

    test('showFileBlame handles no blame data without throwing', async () => {
        const mockBlameProvider = {
            // Simulate a BlameProvider that returns no blame information
            getBlameInfo: async () => {
                return [];
            },
        } as any;

        manager = new GutterAnnotationManager(config, mockBlameProvider);
        const editor = new MockEditor();

        await assert.doesNotReject(async () => {
            await (manager as any).showFileBlame(editor as any);
        });
    });

    test('hideFileBlame clears decorations without throwing', async () => {
        const mockBlameProvider = {
            getBlameInfo: async () => {
                return [];
            },
        } as any;

        manager = new GutterAnnotationManager(config, mockBlameProvider);
        const editor = new MockEditor();

        // First show blame to simulate an active state, then hide it
        await (manager as any).showFileBlame(editor as any);
        await assert.doesNotReject(async () => {
            await (manager as any).hideFileBlame(editor as any);
        });
    });

    test('toggleFileBlame toggles decorations without throwing when no blame data', async () => {
        const mockBlameProvider = {
            getBlameInfo: async () => {
                return [];
            },
        } as any;

        manager = new GutterAnnotationManager(config, mockBlameProvider);
        const editor = new MockEditor();

        // First toggle should show, second should hide; both should succeed
        await assert.doesNotReject(async () => {
            await (manager as any).toggleFileBlame(editor as any);
            await (manager as any).toggleFileBlame(editor as any);
        });
    });

    test('refresh does not throw when there is no blame data', async () => {
        const mockBlameProvider = {
            getBlameInfo: async () => {
                return [];
            },
        } as any;

        manager = new GutterAnnotationManager(config, mockBlameProvider);
        const editor = new MockEditor();

        await assert.doesNotReject(async () => {
            await (manager as any).refresh(editor as any);
        });
    });

    test('switching active editor clears decorations on the previous editor', () => {
        const previousEditor = new MockEditor();
        const nextEditor = new MockEditor();

        // Simulate an active editor with decoration types set
        const mockDecorationType = { dispose: () => {} };
        (manager as any).activeEditor = previousEditor;
        (manager as any).decorationType = mockDecorationType;
        (manager as any).emptyDecorationType = mockDecorationType;
        (manager as any).isVisible = false; // prevent refresh from running

        // Simulate the onDidChangeActiveTextEditor callback firing
        // Directly invoke clearDecorations with previousEditor to mirror the handler
        (manager as any).activeEditor = nextEditor;
        (manager as any).clearDecorations(previousEditor as any);

        // previousEditor should have received two setDecorations calls with empty arrays
        const emptyRangeCalls = previousEditor.setDecorationsCalls.filter(
            c => Array.isArray(c.ranges) && (c.ranges as unknown[]).length === 0
        );
        assert.strictEqual(emptyRangeCalls.length, 2, 'Expected two empty-range setDecorations calls on the previous editor');

        // nextEditor should have received no setDecorations calls
        assert.strictEqual(nextEditor.setDecorationsCalls.length, 0, 'Expected no setDecorations calls on the next editor');
    });
});
