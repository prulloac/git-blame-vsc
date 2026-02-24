import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';

const execAsync = promisify(exec);

/** All-zeros hash git uses for lines that have not been committed yet. */
const UNCOMMITTED_HASH = /^0+$/;

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
 * Provides git blame information for files using raw git CLI execution
 */
export class BlameProvider {
	private blameCache: Map<string, { data: string; timestamp: number }> = new Map();
	private cacheExpiry = 30000; // 30 seconds

	/**
	 * Get blame information for the entire file.
	 * Lines that have not been committed yet are omitted from the result.
	 */
	public async getBlameForFile(filePath: string): Promise<BlameInfo[]> {
		try {
			const blameOutput = await this.getBlameOutput(filePath);
			if (!blameOutput) {
				return [];
			}
			return this.parseBlameOutput(blameOutput);
		} catch (error) {
			console.error('Error getting blame info for file:', error);
			return [];
		}
	}

	/**
	 * Get blame information for a specific line in a file.
	 * Returns null for uncommitted lines so callers show nothing.
	 */
	public async getBlameForLine(filePath: string, lineNumber: number): Promise<BlameInfo | null> {
		try {
			const blameOutput = await this.getBlameOutput(filePath);
			if (!blameOutput) {
				return null;
			}
			return this.parseBlameLineFromOutput(blameOutput, lineNumber);
		} catch (error) {
			console.error('Error getting blame info:', error);
			return null;
		}
	}

	/**
	 * Resolve the git repository root for a given file path.
	 */
	private async getRepoRoot(filePath: string): Promise<string | null> {
		try {
			const { stdout } = await execAsync(
				'git rev-parse --show-toplevel',
				{ cwd: path.dirname(filePath) }
			);
			return stdout.trim();
		} catch {
			return null;
		}
	}

	/**
	 * Run `git blame --line-porcelain` on a file and return the raw output (with caching).
	 * Always runs from the repo root with a repo-relative path so git resolves the file
	 * correctly regardless of where in the tree it lives.
	 */
	private async getBlameOutput(filePath: string): Promise<string | null> {
		const cacheKey = filePath;
		const cached = this.blameCache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
			return cached.data;
		}

		try {
			const repoRoot = await this.getRepoRoot(filePath);
			if (!repoRoot) {
				console.debug('Not inside a git repository:', filePath);
				return null;
			}

			// Build a path relative to the repo root (git expects this)
			const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/');

			const { stdout } = await execAsync(
				`git blame --line-porcelain -- "${relativePath}"`,
				{ cwd: repoRoot }
			);

			if (stdout) {
				this.blameCache.set(cacheKey, { data: stdout, timestamp: Date.now() });
			}
			return stdout || null;
		} catch (error: any) {
			console.error('git blame command failed:', error.message);
			return null;
		}
	}

	/**
	 * Parse a single line from git blame --line-porcelain output.
	 * Returns null for uncommitted lines (all-zeros hash) or if the line is not found.
	 */
	private parseBlameLineFromOutput(output: string, lineNumber: number): BlameInfo | null {
		const lines = output.split('\n');

		let currentLineNum = 0;
		let hash = '';
		let author = '';
		let authorEmail = '';
		let authorTime = '';
		let summary = '';

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line.match(/^[a-f0-9]{40}\s+\d+\s+\d+/)) {
				const parts = line.split(/\s+/);
				hash = parts[0];
				currentLineNum = parseInt(parts[2], 10) - 1; // Convert to 0-indexed

				author = '';
				authorEmail = '';
				authorTime = '';
				summary = '';

				for (let j = i + 1; j < lines.length; j++) {
					const metaLine = lines[j];

					if (metaLine.startsWith('\t')) {
						i = j;
						break;
					}

					if (metaLine.startsWith('author ')) {
						author = metaLine.substring(7);
					} else if (metaLine.startsWith('author-mail ')) {
						authorEmail = metaLine.substring(12).replace(/^<|>$/g, '');
					} else if (metaLine.startsWith('author-time ')) {
						const timestamp = parseInt(metaLine.substring(12), 10);
						const date = new Date(timestamp * 1000);
						authorTime = date.toISOString().substring(0, 10);
					} else if (metaLine.startsWith('summary ')) {
						summary = metaLine.substring(8);
					}
				}

				if (currentLineNum === lineNumber) {
					// Uncommitted lines — show nothing
					if (UNCOMMITTED_HASH.test(hash)) {
						return null;
					}
					const authorShort = author.split(/\s+/)[0];
					return {
						hash,
						author,
						authorEmail,
						authorShort,
						date: authorTime,
						message: summary,
						lineNumber,
					};
				}
			}
		}

		return null;
	}

	/**
	 * Parse the entire git blame --line-porcelain output into an array of BlameInfo objects.
	 * Uncommitted lines (all-zeros hash) are omitted.
	 */
	private parseBlameOutput(output: string): BlameInfo[] {
		const lines = output.split('\n');
		const blameInfos: BlameInfo[] = [];

		let currentLineNum = 0;
		let hash = '';
		let author = '';
		let authorEmail = '';
		let authorTime = '';
		let summary = '';

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			if (line.match(/^[a-f0-9]{40}\s+\d+\s+\d+/)) {
				const parts = line.split(/\s+/);
				hash = parts[0];
				currentLineNum = parseInt(parts[2], 10) - 1;

				author = '';
				authorEmail = '';
				authorTime = '';
				summary = '';

				for (let j = i + 1; j < lines.length; j++) {
					const metaLine = lines[j];

					if (metaLine.startsWith('\t')) {
						i = j;
						break;
					}

					if (metaLine.startsWith('author ')) {
						author = metaLine.substring(7);
					} else if (metaLine.startsWith('author-mail ')) {
						authorEmail = metaLine.substring(12).replace(/^<|>$/g, '');
					} else if (metaLine.startsWith('author-time ')) {
						const timestamp = parseInt(metaLine.substring(12), 10);
						const date = new Date(timestamp * 1000);
						authorTime = date.toISOString().substring(0, 10);
					} else if (metaLine.startsWith('summary ')) {
						summary = metaLine.substring(8);
					}
				}

				// Skip uncommitted lines — show nothing for those
				if (UNCOMMITTED_HASH.test(hash)) {
					continue;
				}

				const authorShort = author.split(/\s+/)[0];
				blameInfos.push({
					hash,
					author,
					authorEmail,
					authorShort,
					date: authorTime,
					message: summary,
					lineNumber: currentLineNum,
				});
			}
		}

		return blameInfos;
	}

	/**
	 * Clear the blame cache
	 */
	public clearCache(): void {
		this.blameCache.clear();
	}

	/**
	 * Invalidate cache for a specific file
	 */
	public invalidateFile(filePath: string): void {
		this.blameCache.delete(filePath);
	}
}
