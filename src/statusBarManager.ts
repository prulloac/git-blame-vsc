import * as vscode from 'vscode';

/**
 * Manages the status bar item that displays git blame information
 * for the currently selected line.
 */
export class StatusBarManager {
	private statusBarItem: vscode.StatusBarItem;
	private enabled: boolean;

	constructor(enabled: boolean) {
		// Create status bar item on the right side with priority 100
		this.statusBarItem = vscode.window.createStatusBarItem(
			vscode.StatusBarAlignment.Right,
			100
		);
		this.enabled = enabled;
		
		// Set tooltip for the status bar item
		this.statusBarItem.tooltip = 'Git Blame Information';
		
		// Show the status bar item if enabled
		if (this.enabled) {
			this.statusBarItem.show();
		}
	}

	/**
	 * Update the status bar with blame information
	 * @param blameText - Formatted blame text to display
	 */
	public updateBlameInfo(blameText: string): void {
		if (this.enabled && blameText) {
			this.statusBarItem.text = `$(git-commit) ${blameText}`;
			this.statusBarItem.show();
		}
	}

	/**
	 * Clear the status bar (hide it when no blame info is available)
	 */
	public clear(): void {
		if (this.enabled) {
			this.statusBarItem.hide();
		}
	}

	/**
	 * Enable or disable the status bar display
	 * @param enabled - Whether to enable the status bar
	 */
	public setEnabled(enabled: boolean): void {
		this.enabled = enabled;
		if (enabled) {
			this.statusBarItem.show();
		} else {
			this.statusBarItem.hide();
		}
	}

	/**
	 * Get the current enabled state
	 */
	public isEnabled(): boolean {
		return this.enabled;
	}

	/**
	 * Dispose of the status bar item
	 */
	public dispose(): void {
		this.statusBarItem.dispose();
	}
}
