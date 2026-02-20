import * as vscode from 'vscode';

/**
 * Manages text editor overlays displayed on specific lines.
 * Shows sample text when a user clicks on a line.
 */
export class OverlayManager {
	private decorationType: vscode.TextEditorDecorationType;
	private currentLine: number | null = null;
	private activeEditor: vscode.TextEditor | null = null;

	constructor() {
		// Create decoration type for the overlay
		this.decorationType = vscode.window.createTextEditorDecorationType({
			backgroundColor: '#FFD700',
			color: '#000000',
			after: {
				contentText: '',
				margin: '0 0 0 1rem',
				backgroundColor: '#FFD700',
				color: '#000000',
				fontWeight: 'bold',
			},
			isWholeLine: false,
		});
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
					margin: '0 0 0 1rem',
					backgroundColor: '#FFD700',
					color: '#000000',
					fontWeight: 'bold',
					border: '1px solid #FFA500',
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
