import * as vscode from 'vscode';
import { execSync } from 'child_process';

/**
 * Represents blame information for a single line
 */
export interface BlameInfo {
	hash: string;
	author: string;          // Full name (e.g., "John Doe")
	authorEmail: string;     // Email (e.g., "john@example.com")
	authorShort: string;     // First word of name (e.g., "John")
	date: string;
	message: string;
	lineNumber: number;
}

/**
 * Provides git blame information for files
 */
export class BlameProvider {
	private blameCache: Map<string, { data: string; timestamp: number }> = new Map();
	private cacheExpiry = 30000; // 30 seconds

	constructor() {
		// No longer need to store gitAPI
	}

	/**
	 * Get blame information for a specific line in a file
	 */
	public async getBlameForLine(filePath: string, lineNumber: number): Promise<BlameInfo | null> {
		try {
			// Get the workspace folder for this file
			const fileUri = vscode.Uri.file(filePath);
			const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);

			if (!workspaceFolder) {
				console.debug('No workspace folder found for file:', filePath);
				return null;
			}

			console.debug('Getting blame for:', filePath, 'line:', lineNumber);

			// Get blame output for the file
			const blameOutput = await this.getBlameOutput(workspaceFolder.uri.fsPath, filePath);
			if (!blameOutput) {
				console.debug('No blame output received');
				return null;
			}

			console.debug('Blame output length:', blameOutput.length, 'lines:', blameOutput.split('\n').length);

			// Parse the blame output for the specific line
			const lineBlame = this.parseBlameLineFromOutput(blameOutput, lineNumber);
			if (!lineBlame) {
				console.debug('Failed to parse blame for line:', lineNumber);
				return null;
			}

			console.debug('Parsed blame:', lineBlame);

			// Try to get the full commit message
			try {
				const message = await this.getCommitMessage(workspaceFolder.uri.fsPath, lineBlame.hash);
				console.debug('Got commit message:', message);
				return {
					...lineBlame,
					message: message,
				};
			} catch (error) {
				console.debug('Error getting commit message:', error);
				return lineBlame; // Return blame without message
			}
		} catch (error) {
			console.error('Error getting blame info:', error);
			return null;
		}
	}

	/**
	 * Get blame output for entire file (with caching)
	 */
	private async getBlameOutput(repoRoot: string, filePath: string): Promise<string | null> {
		try {
			// Convert absolute path to relative path from repo root
			const relativePath = filePath
				.replace(repoRoot + '/', '')
				.replace(repoRoot + '\\', '')
				.replace(/\\/g, '/');

			console.debug('Repo root:', repoRoot);
			console.debug('File path:', filePath);
			console.debug('Relative path:', relativePath);

			const cacheKey = `${repoRoot}:${relativePath}`;
			const cached = this.blameCache.get(cacheKey);

			// Return cached data if still valid
			if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
				console.debug('Using cached blame data');
				return cached.data;
			}

			console.debug('Fetching blame output for:', relativePath);

			// Run git blame command directly
			const command = `cd "${repoRoot}" && git blame "${relativePath}"`;
			console.debug('Running command:', command);

			let output: string;
			try {
				output = execSync(command, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
			} catch (error: any) {
				console.error('Git blame command failed:', error.message);
				return null;
			}

			console.debug('Blame output received:', output ? output.length + ' chars' : 'null');

			if (output) {
				this.blameCache.set(cacheKey, { data: output, timestamp: Date.now() });
			}
			return output;
		} catch (error) {
			console.error('Error getting blame output:', error);
			return null;
		}
	}

	/**
	 * Get the commit message for a commit hash
	 */
	private async getCommitMessage(repoRoot: string, hash: string): Promise<string> {
		try {
			const command = `cd "${repoRoot}" && git log -1 --format=%s "${hash}"`;
			console.debug('Getting commit message:', command);
			const output = execSync(command, { encoding: 'utf-8' }).trim();
			return output;
		} catch (error) {
			console.error('Error getting commit message:', error);
			return '(no message)';
		}
	}

	/**
	 * Parse a single line from git blame output
	 * Format: <hash> (<author> <date> <time> <timezone> <line-number>) <content>
	 */
	private parseBlameLineFromOutput(output: string, lineNumber: number): BlameInfo | null {
		const lines = output.split('\n');

		console.debug('Total lines in blame output:', lines.length);
		console.debug('Looking for line number:', lineNumber);

		if (lineNumber < 0 || lineNumber >= lines.length) {
			console.debug('Line number out of bounds');
			return null;
		}

		const line = lines[lineNumber];
		if (!line) {
			console.debug('Line is empty or null');
			return null;
		}

		console.debug('Parsing blame line:', line.substring(0, 100));

		// Regex to parse git blame format
		// Example: ^8e42b0a (Pablo Ulloa 2026-02-20 22:59:24 +0000 1) dsfas
		// Format: <hash> (<author-and-date> <timezone> <line-number>) <content>
		const match = line.match(/^([a-f0-9^]+)\s+\((.+?)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+([+-]\d{4})\s+(\d+)\)/);

		if (!match) {
			console.debug('Regex did not match. Line content:', line);
			return null;
		}

		console.debug('Regex matched!');

		const [, hash, authorInfo, date, timezone] = match;
		
		// Author info contains: "Name email" at the beginning
		// Format: "Pablo Ulloa pablo@example.com"
		const authorMatch = authorInfo.trim().match(/^(.+?)\s+(<.+>|\S+@\S+|\S+)$/);
		
		let authorName = 'Unknown';
		let authorEmail = '';
		let authorShort = 'Unknown';
		
		if (authorMatch) {
			authorName = authorMatch[1].trim();
			authorEmail = authorMatch[2].trim().replace(/^<|>$/g, ''); // Remove angle brackets if present
			// Get first word of name as short name
			authorShort = authorName.split(/\s+/)[0];
		} else {
			// Fallback: split by whitespace
			const authorParts = authorInfo.trim().split(/\s+/);
			if (authorParts.length >= 2) {
				authorEmail = authorParts[authorParts.length - 1];
				authorName = authorParts.slice(0, -1).join(' ');
				authorShort = authorParts[0];
			} else {
				authorName = authorInfo.trim();
				authorShort = authorName.split(/\s+/)[0];
			}
		}
		
		// Combine date and timezone for full datetime
		const fullDate = `${date} ${timezone}`;

		console.debug('Parsed - hash:', hash, 'author:', authorName, 'email:', authorEmail, 'short:', authorShort, 'date:', fullDate);

		return {
			hash: hash.replace(/^\^/, '').substring(0, 7), // Remove ^ prefix if present and use short hash
			author: authorName,
			authorEmail,
			authorShort,
			date: fullDate,
			message: '', // Will be fetched from commit
			lineNumber,
		};
	}

	/**
	 * Clear the blame cache
	 */
	public clearCache(): void {
		this.blameCache.clear();
	}
}

