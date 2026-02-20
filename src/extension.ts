// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { OverlayManager, OverlayConfig } from './overlayManager';
import { BlameProvider } from './blameProvider';

let overlayManager: OverlayManager | null = null;
let blameProvider: BlameProvider | null = null;

/**
 * Get current configuration from VS Code settings
 * Returns undefined for color settings to use theme defaults unless user explicitly set a value
 */
function getOverlayConfig(): OverlayConfig {
	const config = vscode.workspace.getConfiguration('gitBlameOverlay');
	return {
		backgroundColor: config.get<string>('backgroundColor'),
		textColor: config.get<string>('textColor'),
		borderColor: config.get<string>('borderColor'),
		fontWeight: config.get('fontWeight', 'bold'),
		fontStyle: config.get('fontStyle', 'italic') as 'normal' | 'italic',
		opacity: config.get('opacity', 0.6),
		marginLeft: config.get('marginLeft', '1rem'),
	};
}

/**
 * Get blame formatting configuration
 */
function getBlameFormatConfig(): { pattern: string; maxMessageLength: number } {
	const config = vscode.workspace.getConfiguration('gitBlameOverlay');
	return {
		pattern: config.get('outputPattern', '[<hash>] <author> (<date>): <message>'),
		maxMessageLength: config.get('maxMessageLength', 24),
	};
}

/**
 * Initialize git blame provider
 */
async function initializeBlameProvider(): Promise<BlameProvider | null> {
	try {
		// Just create the blame provider - it uses git command directly
		return new BlameProvider();
	} catch (error) {
		console.error('Failed to initialize blame provider:', error);
		return null;
	}
}

/**
 * Format blame information using configurable pattern
 */
function formatBlameText(blameInfo: { author: string; authorEmail: string; authorShort: string; message: string; hash: string; date: string }): string {
	const { pattern, maxMessageLength } = getBlameFormatConfig();
	
	// Extract just the date part (YYYY-MM-DD)
	const dateOnly = blameInfo.date.split(' ')[0];
	
	// Truncate message if needed
	const truncatedMsg = blameInfo.message.length > maxMessageLength 
		? blameInfo.message.substring(0, maxMessageLength) + '...' 
		: blameInfo.message;
	
	// Replace pattern variables with actual values
	let output = pattern
		.replace(/<hash>/g, blameInfo.hash)
		.replace(/<author>/g, blameInfo.author)
		.replace(/<authorShort>/g, blameInfo.authorShort)
		.replace(/<authorEmail>/g, blameInfo.authorEmail)
		.replace(/<date>/g, dateOnly)
		.replace(/<message>/g, truncatedMsg);
	
	return output;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "git-blame-vsc" is now active!');

	// Initialize OverlayManager with current configuration
	overlayManager = new OverlayManager(getOverlayConfig());

	// Initialize BlameProvider
	blameProvider = await initializeBlameProvider();
	if (!blameProvider) {
		console.log('Git blame feature unavailable');
	}

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

		// Try to get git blame information
		if (blameProvider && editor.document.uri.scheme === 'file') {
			blameProvider.getBlameForLine(editor.document.fileName, line).then((blameInfo) => {
				if (blameInfo && overlayManager) {
					const blameText = formatBlameText({
						author: blameInfo.author,
						authorEmail: blameInfo.authorEmail,
						authorShort: blameInfo.authorShort,
						message: blameInfo.message || '(no message)',
						hash: blameInfo.hash,
						date: blameInfo.date
					});
					overlayManager.showOverlay(line, editor, blameText);
				} else if (overlayManager) {
					// Fallback to sample text if blame info unavailable
					overlayManager.showOverlay(line, editor);
				}
			}).catch((error) => {
				console.error('Error getting blame info:', error);
				// Fallback to sample text on error
				if (overlayManager) {
					overlayManager.showOverlay(line, editor);
				}
			});
		} else {
			// Show overlay on the clicked line (without blame info)
			overlayManager.showOverlay(line, editor);
		}
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
			if (blameProvider) {
				blameProvider.clearCache();
				blameProvider = null;
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
	if (blameProvider) {
		blameProvider.clearCache();
		blameProvider = null;
	}
}
