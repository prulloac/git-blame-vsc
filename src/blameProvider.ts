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
				return null;
			}

			// Get the repository
			const repo = this.gitAPI.getRepository(workspaceFolder.uri);
			if (!repo) {
				return null;
			}

			// Get blame output for the file
			const blameOutput = await this.getBlameOutput(repo, filePath);
			if (!blameOutput) {
				return null;
			}

			// Parse the blame output for the specific line
			const lineBlame = this.parseBlameLineFromOutput(blameOutput, lineNumber);
			if (!lineBlame) {
				return null;
			}

			// Get the full commit message
			const commit = await repo.getCommit(lineBlame.hash);
			if (!commit) {
				return lineBlame;
			}

			return {
				...lineBlame,
				message: commit.message.split('\n')[0], // First line of commit message
			};
		} catch (error) {
			console.error('Error getting blame info:', error);
			return null;
		}
	}

	/**
	 * Get blame output for entire file (with caching)
	 */
	private async getBlameOutput(repo: any, filePath: string): Promise<string | null> {
		const cacheKey = `${repo.rootUri.fsPath}:${filePath}`;
		const cached = this.blameCache.get(cacheKey);

		// Return cached data if still valid
		if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
			return cached.data;
		}

		try {
			// Call git blame command
			const output = await repo.blame(filePath);
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
		if (lineNumber < 0 || lineNumber >= lines.length) {
			return null;
		}

		const line = lines[lineNumber];
		if (!line) {
			return null;
		}

		// Regex to parse git blame format
		// Example: 25418bf4 (John Doe 2024-02-20 10:30:45 +0000)  1) console.log('hello');
		const match = line.match(/^([a-f0-9]+)\s+\(([^)]+?)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+[+-]\d{4})\s+(\d+)\)/);

		if (!match) {
			return null;
		}

		const [, hash, authorInfo, date] = match;
		// Author info format: "Name email"
		const authorParts = authorInfo.trim().split(/\s+/);
		const author = authorParts.slice(0, -1).join(' ') || 'Unknown';

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
