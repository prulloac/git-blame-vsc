import * as vscode from 'vscode';

/**
 * Represents blame information for a single line
 */
export interface BlameInfo {
	hash: string;
	author: string;
	date: string;
	message: string;
	lineNumber: number;
}

/**
 * Provides git blame information for files
 */
export class BlameProvider {
	private gitAPI: any;
	private blameCache: Map<string, { data: string; timestamp: number }> = new Map();
	private cacheExpiry = 30000; // 30 seconds

	constructor(gitAPI: any) {
		this.gitAPI = gitAPI;
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

			// Get the repository
			const repo = this.gitAPI.getRepository(workspaceFolder.uri);
			if (!repo) {
				console.debug('No git repository found');
				return null;
			}

			console.debug('Getting blame for:', filePath, 'line:', lineNumber);

			// Get blame output for the file
			const blameOutput = await this.getBlameOutput(repo, filePath);
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

			// Get the full commit message
			try {
				const commit = await repo.getCommit(lineBlame.hash);
				if (!commit) {
					console.debug('No commit found for hash:', lineBlame.hash);
					return lineBlame;
				}

				console.debug('Got commit:', commit.message?.split('\n')[0]);

				return {
					...lineBlame,
					message: commit.message.split('\n')[0], // First line of commit message
				};
			} catch (commitError) {
				console.debug('Error getting commit details:', commitError);
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
	private async getBlameOutput(repo: any, filePath: string): Promise<string | null> {
		try {
			// Convert absolute path to relative path from repo root
			const repoRoot = repo.rootUri.fsPath;
			const relativePath = filePath.replace(repoRoot + '/', '').replace(/\\/g, '/');
			
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

			// Call git blame command - use relative path
			const output = await repo.blame(relativePath);
			
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
	 * Parse a single line from git blame output
	 * Format: <hash> (<author> <date> <time> <timezone>) <line-number>
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
		// Example: 25418bf4 (John Doe 2024-02-20 10:30:45 +0000)  1) console.log('hello');
		const match = line.match(/^([a-f0-9]+)\s+\(([^)]+?)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+[+-]\d{4})\s+(\d+)\)/);

		if (!match) {
			console.debug('Regex did not match. Line content:', line);
			return null;
		}

		console.debug('Regex matched!');

		const [, hash, authorInfo, date] = match;
		// Author info format: "Name email"
		const authorParts = authorInfo.trim().split(/\s+/);
		const author = authorParts.slice(0, -1).join(' ') || 'Unknown';

		console.debug('Parsed - hash:', hash, 'author:', author, 'date:', date);

		return {
			hash: hash.substring(0, 7), // Short hash
			author,
			date,
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
