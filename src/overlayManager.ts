import * as vscode from 'vscode';

/**
 * Configuration for the overlay appearance and behavior
 * Colors can be hex strings (e.g., '#FFD700') or undefined to use theme defaults
 */
export interface OverlayConfig {
	backgroundColor: string | undefined;
	textColor: string | undefined;
	borderColor: string | undefined;
	fontWeight: string;
	marginLeft: string;
}

/**
 * Resolves a color to either a hex string or ThemeColor
 */
function resolveColor(colorValue: string | undefined, themeColorId: string): string | vscode.ThemeColor {
	if (colorValue && colorValue.startsWith('#')) {
		// User provided a hex color
		return colorValue;
	}
	// Use theme color
	return new vscode.ThemeColor(themeColorId);
}

/**
 * Manages text editor overlays displayed on specific lines.
 * Shows sample text when a user clicks on a line.
 */
export class OverlayManager {
	private decorationType: vscode.TextEditorDecorationType;
	private currentLine: number | null = null;
	private activeEditor: vscode.TextEditor | null = null;
	private config: OverlayConfig;

	constructor(config: OverlayConfig) {
		this.config = config;
		// Create decoration type for the overlay
		this.decorationType = this.createDecorationType(config);
	}

	/**
	 * Create decoration type based on configuration
	 */
	private createDecorationType(config: OverlayConfig): vscode.TextEditorDecorationType {
		return vscode.window.createTextEditorDecorationType({
			after: {
				contentText: '',
				margin: `0 0 0 ${config.marginLeft}`,
				backgroundColor: resolveColor(config.backgroundColor, 'editor.background'),
				color: resolveColor(config.textColor, 'editor.foreground'),
				fontWeight: config.fontWeight as any,
			},
			isWholeLine: false,
		});
	}

	/**
	 * Update configuration and recreate decoration type
	 */
	public updateConfig(config: OverlayConfig): void {
		this.config = config;
		this.decorationType.dispose();
		this.decorationType = this.createDecorationType(config);
		// Redraw current overlay if one exists
		if (this.activeEditor && this.currentLine !== null) {
			this.showOverlay(this.currentLine, this.activeEditor);
		}
	}

	/**
	 * Show overlay on the given line in the active editor
	 */
	public showOverlay(line: number, editor: vscode.TextEditor): void {
		this.activeEditor = editor;
		this.currentLine = line;

		const sampleText = `[Sample: Line ${line + 1}]`;

		// Create range for the end of the line
		const lineLength = editor.document.lineAt(line).text.length;
		const range = new vscode.Range(
			new vscode.Position(line, lineLength),
			new vscode.Position(line, lineLength)
		);

		// Resolve border color - use a dimmed version of the theme color
		const borderColor = resolveColor(this.config.borderColor, 'editorBracketMatch.border');

		// Apply decoration with the sample text
		const decoration: vscode.DecorationOptions = {
			range: range,
			renderOptions: {
				after: {
					contentText: sampleText,
					margin: `0 0 0 ${this.config.marginLeft}`,
					backgroundColor: resolveColor(this.config.backgroundColor, 'editor.background'),
					color: resolveColor(this.config.textColor, 'editor.foreground'),
					fontWeight: this.config.fontWeight as any,
					border: `1px solid ${borderColor}`,
				},
			},
		};

		editor.setDecorations(this.decorationType, [decoration]);
	}

	/**
	 * Clear all overlays
	 */
	public clearOverlay(): void {
		if (this.activeEditor) {
			this.activeEditor.setDecorations(this.decorationType, []);
		}
		this.currentLine = null;
		this.activeEditor = null;
	}

	/**
	 * Get the currently displayed line, or null if no overlay is shown
	 */
	public getCurrentLine(): number | null {
		return this.currentLine;
	}

	/**
	 * Dispose of resources when the extension is deactivated
	 */
	public dispose(): void {
		this.decorationType.dispose();
		this.clearOverlay();
	}
}
