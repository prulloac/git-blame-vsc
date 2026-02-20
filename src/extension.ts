// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { OverlayManager, OverlayConfig } from './overlayManager';

let overlayManager: OverlayManager | null = null;

/**
 * Get current configuration from VS Code settings
 */
function getOverlayConfig(): OverlayConfig {
	const config = vscode.workspace.getConfiguration('gitBlameOverlay');
	return {
		backgroundColor: config.get('backgroundColor', '#FFD700'),
		textColor: config.get('textColor', '#000000'),
		borderColor: config.get('borderColor', '#FFA500'),
		fontWeight: config.get('fontWeight', 'bold'),
		fontSize: config.get('fontSize', '0.85em'),
		marginLeft: config.get('marginLeft', '1rem'),
	};
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lightweight-git-blame" is now active!');

	// Initialize OverlayManager with current configuration
	overlayManager = new OverlayManager(getOverlayConfig());

	// Register the helloWorld command
	const helloWorldDisposable = vscode.commands.registerCommand('git-blame-vsc.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from git-blame-vsc!');
	});

	// Register the clearOverlay command
	const clearOverlayDisposable = vscode.commands.registerCommand('git-blame-vsc.clearOverlay', () => {
		if (overlayManager) {
			overlayManager.clearOverlay();
		}
	});

	// Listen for editor click events to show overlay
	const editorClickDisposable = vscode.window.onDidChangeTextEditorSelection((event) => {
		if (!overlayManager) {
			return;
		}

		const editor = event.textEditor;
		const line = editor.selection.active.line;

		// Show overlay on the clicked line
		overlayManager.showOverlay(line, editor);
	});

	// Listen for configuration changes and update overlay
	const configChangeDisposable = vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('gitBlameOverlay') && overlayManager) {
			overlayManager.updateConfig(getOverlayConfig());
		}
	});

	context.subscriptions.push(
		helloWorldDisposable,
		clearOverlayDisposable,
		editorClickDisposable,
		configChangeDisposable
	);

	// Dispose of overlay manager when extension is deactivated
	context.subscriptions.push({
		dispose: () => {
			if (overlayManager) {
				overlayManager.dispose();
				overlayManager = null;
			}
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (overlayManager) {
		overlayManager.dispose();
		overlayManager = null;
	}
}
