import * as vscode from 'vscode';

/**
 * Configuration for the overlay appearance and behavior
 */
export interface OverlayConfig {
	backgroundColor: string;
	textColor: string;
	borderColor: string;
	fontWeight: string;
	fontSize: string;
	marginLeft: string;
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
				backgroundColor: config.backgroundColor,
				color: config.textColor,
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

		// Apply decoration with the sample text
		const decoration: vscode.DecorationOptions = {
			range: range,
			renderOptions: {
				after: {
					contentText: sampleText,
					margin: `0 0 0 ${this.config.marginLeft}`,
					backgroundColor: this.config.backgroundColor,
					color: this.config.textColor,
					fontWeight: this.config.fontWeight as any,
					border: `1px solid ${this.config.borderColor}`,
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
