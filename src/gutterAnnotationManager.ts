import * as vscode from 'vscode';
import { BlameProvider, BlameInfo } from './blameProvider';

/**
 * Configuration for the gutter annotations
 */
export interface GutterAnnotationConfig {
    enabled: boolean;
    authorFormat: 'initials' | 'fullName' | 'email';
}

/** Fixed column width for all gutter annotations (in characters). */
const GUTTER_WIDTH = 12;

/** Debounce delay (ms) for refreshing annotations on text document changes. */
const DEBOUNCE_DELAY_MS = 300;

/**
 * Manages gutter annotations (file blame) displayed on the editor.
 */
export class GutterAnnotationManager {
    private config: GutterAnnotationConfig;
    private blameProvider: BlameProvider | null = null;
    private activeEditor: vscode.TextEditor | undefined;
    private decorationType: vscode.TextEditorDecorationType | undefined;
    private emptyDecorationType: vscode.TextEditorDecorationType | undefined;
    private disposables: vscode.Disposable[] = [];
    private isVisible: boolean = false;
    private debounceTimer: ReturnType<typeof setTimeout> | undefined;

    constructor(config: GutterAnnotationConfig, blameProvider: BlameProvider | null) {
        this.config = config;
        this.blameProvider = blameProvider;
        this.activeEditor = vscode.window.activeTextEditor;

        // Initialize visibility based on config
        this.isVisible = this.config.enabled;

        // If enabled at startup, trigger refresh
        if (this.isVisible && this.activeEditor) {
            this.refresh();
        }

        // Listen for active editor changes to re-apply if enabled
        this.disposables.push(
            vscode.window.onDidChangeActiveTextEditor(editor => {
                this.activeEditor = editor;
                if (this.isVisible && this.activeEditor) {
                    this.refresh();
                }
            }),
            // Refresh on edit, debounced so rapid keystrokes don't each trigger
            // a full re-render. The refresh clamps line numbers to the current
            // document length, so stale cache entries never produce out-of-bounds
            // decorations.
            vscode.workspace.onDidChangeTextDocument(event => {
                if (this.isVisible && this.activeEditor && event.document === this.activeEditor.document) {
                    if (this.debounceTimer !== undefined) {
                        clearTimeout(this.debounceTimer);
                    }
                    this.debounceTimer = setTimeout(() => {
                        this.debounceTimer = undefined;
                        this.refresh();
                    }, DEBOUNCE_DELAY_MS);
                }
            }),
            // On save: invalidate the cache so the next refresh fetches fresh
            // blame data from git (reflecting the newly committed state).
            vscode.workspace.onDidSaveTextDocument(document => {
                if (this.isVisible && this.activeEditor && document === this.activeEditor.document) {
                    if (this.blameProvider) {
                        this.blameProvider.invalidateFile(document.fileName);
                    }
                    this.refresh();
                }
            })
        );
    }

    /**
     * Update configuration
     */
    public updateConfig(config: GutterAnnotationConfig): void {
        const wasVisible = this.isVisible;
        this.config = config;
        this.isVisible = config.enabled;

        if (this.isVisible && !wasVisible) {
            this.refresh();
        } else if (!this.isVisible && wasVisible) {
            this.clear();
        } else if (this.isVisible) {
            // Other settings (e.g. authorFormat) changed while visible — re-render
            this.refresh();
        }
    }

    /**
     * Show file blame annotations
     */
    public async showFileBlame(): Promise<void> {
        this.isVisible = true;
        this.config.enabled = true;
        await this.refresh();
    }

    /**
     * Hide file blame annotations
     */
    public hideFileBlame(): void {
        this.isVisible = false;
        this.config.enabled = false;
        this.clear();
    }

    /**
     * Toggle file blame annotations
     */
    public toggleFileBlame(): void {
        if (this.isVisible) {
            this.hideFileBlame();
        } else {
            this.showFileBlame();
        }
    }

    /**
     * Refresh annotations for the current editor
     */
    private async refresh(): Promise<void> {
        if (!this.activeEditor || !this.blameProvider) {
            return;
        }

        const document = this.activeEditor.document;
        const filePath = document.fileName;

        // Only process file scheme
        if (document.uri.scheme !== 'file') {
            return;
        }

        console.debug('Refreshing file blame for:', filePath);

        try {
            const blameData = await this.blameProvider.getBlameForFile(filePath);
            
            if (blameData.length === 0) {
                console.debug('No blame data found for file');
                this.clearDecorations();
                return;
            }

            // Create or update decoration type
            if (!this.decorationType) {
                this.decorationType = vscode.window.createTextEditorDecorationType({
                    isWholeLine: true,
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
                    before: {
                        color: new vscode.ThemeColor('editorCodeLens.foreground'),
                        backgroundColor: new vscode.ThemeColor('editorGutter.background'),
                        fontStyle: 'normal',
                        // Reserve exactly GUTTER_WIDTH characters + separator using ch units
                        width: `${GUTTER_WIDTH + 2}ch`,
                        textDecoration: 'none; display: inline-block; overflow: hidden; white-space: nowrap;',
                    }
                });
            }

            if (!this.emptyDecorationType) {
                this.emptyDecorationType = vscode.window.createTextEditorDecorationType({
                    isWholeLine: true,
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
                    before: {
                        contentText: '',
                        backgroundColor: new vscode.ThemeColor('editorGutter.background'),
                        width: `${GUTTER_WIDTH + 2}ch`,
                        textDecoration: 'none; display: inline-block;',
                    }
                });
            }

            const decorations: vscode.DecorationOptions[] = [];
            const blamedLines = new Set<number>();
            const lineCount = document.lineCount;

            // Process blame data — skip any line numbers that are beyond the
            // current document length (can happen when cache is from before a deletion)
            blameData.forEach(info => {
                const lineNumber = info.lineNumber;
                if (lineNumber < 0 || lineNumber >= lineCount) {
                    return;
                }
                blamedLines.add(lineNumber);
                const annotationText = this.formatAnnotation(info);

                // Create decoration for the line
                const decoration: vscode.DecorationOptions = {
                    range: new vscode.Range(lineNumber, 0, lineNumber, 0),
                    renderOptions: {
                        before: {
                            contentText: annotationText,
                        }
                    }
                };

                decorations.push(decoration);
            });

            // Build empty decorations for lines that have no blame data
            const emptyDecorations: vscode.DecorationOptions[] = [];
            for (let i = 0; i < lineCount; i++) {
                if (!blamedLines.has(i)) {
                    emptyDecorations.push({ range: new vscode.Range(i, 0, i, 0) });
                }
            }

            // Apply both decoration types
            if (this.activeEditor) {
                this.activeEditor.setDecorations(this.decorationType, decorations);
                this.activeEditor.setDecorations(this.emptyDecorationType, emptyDecorations);
            }

        } catch (error) {
            console.error('Error refreshing gutter annotations:', error);
        }
    }

    /**
     * Format blame annotation text based on configuration.
     * Result is always truncated/padded to GUTTER_WIDTH characters.
     */
    private formatAnnotation(info: BlameInfo): string {
        let text: string;
        switch (this.config.authorFormat) {
            case 'initials':
                text = info.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                break;
            case 'email':
                text = info.authorEmail;
                break;
            case 'fullName':
                text = info.author;
                break;
        }
        // Truncate to GUTTER_WIDTH, appending ellipsis if cut; pad with spaces if shorter
        if (text.length > GUTTER_WIDTH) {
            return text.substring(0, GUTTER_WIDTH) + '…';
        }
        return text.padEnd(GUTTER_WIDTH);
    }

    /**
     * Clear all decoration ranges from the active editor without disposing
     * the decoration type objects. This is cheap and avoids stale annotations
     * while the user is editing (before the next save + refresh).
     */
    private clearDecorations(): void {
        if (this.activeEditor) {
            if (this.decorationType) {
                this.activeEditor.setDecorations(this.decorationType, []);
            }
            if (this.emptyDecorationType) {
                this.activeEditor.setDecorations(this.emptyDecorationType, []);
            }
        }
    }

    /**
     * Clear all annotations and dispose decoration type objects
     */
    private clear(): void {
        if (this.decorationType) {
            this.decorationType.dispose();
            this.decorationType = undefined;
        }
        if (this.emptyDecorationType) {
            this.emptyDecorationType.dispose();
            this.emptyDecorationType = undefined;
        }
    }

    /**
     * Dispose of resources
     */
    public dispose(): void {
        if (this.debounceTimer !== undefined) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = undefined;
        }
        this.clear();
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}
