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
			return lineBlame;
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

			// Run git blame command with --line-porcelain for structured output
			const command = `cd "${repoRoot}" && git blame --line-porcelain "${relativePath}"`;
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
	 * Parse a single line from git blame --line-porcelain output
	 * Porcelain format provides structured data with each commit's info on separate lines
	 */
	private parseBlameLineFromOutput(output: string, lineNumber: number): BlameInfo | null {
		const lines = output.split('\n');
		
		console.debug('Total lines in porcelain output:', lines.length);
		console.debug('Looking for line number:', lineNumber + 1); // Git uses 1-indexed line numbers

		// Parse porcelain format - each blame entry starts with hash and line numbers
		// Format:
		// <hash> <original-line> <final-line> <num-lines>
		// author <name>
		// author-mail <email>
		// author-time <timestamp>
		// author-tz <timezone>
		// committer <name>
		// committer-mail <email>
		// committer-time <timestamp>
		// committer-tz <timezone>
		// summary <message>
		// ... other fields ...
		// \t<actual line content>
		
		let currentLineNum = 0;
		let hash = '';
		let author = '';
		let authorEmail = '';
		let authorTime = '';
		let summary = '';
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			
			// Check if this is the start of a new blame block
			if (line.match(/^[a-f0-9]{40}\s+\d+\s+\d+/)) {
				const parts = line.split(/\s+/);
				hash = parts[0];
				currentLineNum = parseInt(parts[2], 10) - 1; // Convert to 0-indexed
				
				// Reset fields for this block
				author = '';
				authorEmail = '';
				authorTime = '';
				summary = '';
				
				console.debug('Found blame block - hash:', hash, 'line:', currentLineNum);
				
				// Parse the metadata lines that follow
				for (let j = i + 1; j < lines.length; j++) {
					const metaLine = lines[j];
					
					// Stop when we hit the actual content line (starts with tab)
					if (metaLine.startsWith('\t')) {
						i = j; // Update outer loop position
						break;
					}
					
					if (metaLine.startsWith('author ')) {
						author = metaLine.substring(7);
					} else if (metaLine.startsWith('author-mail ')) {
						// Remove angle brackets from email
						authorEmail = metaLine.substring(12).replace(/^<|>$/g, '');
					} else if (metaLine.startsWith('author-time ')) {
						const timestamp = parseInt(metaLine.substring(12), 10);
						// Convert Unix timestamp to YYYY-MM-DD format
						const date = new Date(timestamp * 1000);
						authorTime = date.toISOString().substring(0, 10); // Get YYYY-MM-DD
					} else if (metaLine.startsWith('summary ')) {
						summary = metaLine.substring(8);
					}
				}
				
				// Check if this is the line we're looking for
				if (currentLineNum === lineNumber) {
					const authorShort = author.split(/\s+/)[0];
					
					console.debug('Found target line!');
					console.debug('Parsed - hash:', hash, 'author:', author, 'email:', authorEmail, 'short:', authorShort, 'date:', authorTime);
					
					return {
						hash: hash, // Keep full hash for now, we'll handle short hash in the formatter
						author: author,
						authorEmail: authorEmail,
						authorShort: authorShort,
						date: authorTime,
						message: summary,
						lineNumber: lineNumber,
					};
				}
			}
		}
		
		console.debug('Line not found in blame output');
		return null;
	}

	/**
	 * Clear the blame cache
	 */
	public clearCache(): void {
		this.blameCache.clear();
	}
}

