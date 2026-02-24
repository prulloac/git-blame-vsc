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
});
