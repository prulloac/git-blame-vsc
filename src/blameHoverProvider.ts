import * as vscode from 'vscode';
import { BlameProvider } from './blameProvider';

/**
 * Provides rich hover tooltips with git blame information
 */
export class BlameHoverProvider implements vscode.HoverProvider {
	constructor(private blameProvider: BlameProvider) {}

	/**
	 * Provide hover information for a position in a document
	 */
	async provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.Hover | null> {
		// Only provide hovers for files (not virtual documents)
		if (document.uri.scheme !== 'file') {
			return null;
		}

		// Check if cancellation was requested
		if (token.isCancellationRequested) {
			return null;
		}

		// Get configured hover delay
		const config = vscode.workspace.getConfiguration('gitBlameOverlay');
		const hoverDelay = config.get<number>('hoverDelay', 2000);

		// Wait for the configured delay before showing hover
		if (hoverDelay > 0) {
			await new Promise(resolve => setTimeout(resolve, hoverDelay));
			
			// Check if cancellation was requested during delay
			if (token.isCancellationRequested) {
				return null;
			}
		}

		try {
			// Get blame information for the line
			const blameInfo = await this.blameProvider.getBlameForLine(
				document.fileName,
				position.line
			);

			// Return null if no blame info available (non-git file, uncommitted, etc.)
			if (!blameInfo) {
				return null;
			}

			// Check cancellation again after async operation
			if (token.isCancellationRequested) {
				return null;
			}

			// Format blame information as markdown
			const markdown = new vscode.MarkdownString();
			markdown.isTrusted = true;
			
			// Header
			markdown.appendMarkdown(`**Git Blame Information**\n\n`);
			
			// Commit hash (short 7-char version)
			const shortHash = blameInfo.hash.substring(0, 7);
			markdown.appendMarkdown(`**Commit**: \`${shortHash}\`\n`);
			
			// Author with email
			markdown.appendMarkdown(`**Author**: ${blameInfo.author}`);
			if (blameInfo.authorEmail) {
				markdown.appendMarkdown(` <${blameInfo.authorEmail}>`);
			}
			markdown.appendMarkdown(`\n`);
			
			// Date
			markdown.appendMarkdown(`**Date**: ${blameInfo.date}\n\n`);
			
			// Commit message (full message, no truncation)
			if (blameInfo.message) {
				markdown.appendMarkdown(`**Message**:\n\n${blameInfo.message}\n`);
			}

			// Create hover for the entire line
			const lineRange = new vscode.Range(
				position.line,
				0,
				position.line,
				Number.MAX_VALUE
			);

			return new vscode.Hover(markdown, lineRange);
		} catch (error) {
			console.error('Error providing blame hover:', error);
			return null;
		}
	}
}
