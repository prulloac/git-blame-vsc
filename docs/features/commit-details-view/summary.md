# Commit Details View Feature

## Overview

The Commit Details View feature provides developers with comprehensive commit information through an integrated VS Code Quick Pick or dedicated panel, enabling deep investigation of code changes without leaving the editor environment.

## Status

- **Status**: 🚧 Planned (Not Yet Implemented)
- **Version**: Proposed for v0.0.3+
- **Since**: Proposed in v0.0.2 planning phase

## Feature Type

**Category**: Extended Functionality ➕ / Developer Experience 🛠️  
**Type**: Enhancement to core git blame functionality that provides detailed commit inspection capabilities

This feature extends the core git blame overlay by allowing developers to dive deeper into commit details. While the overlay shows quick contextual information, this feature provides comprehensive commit metadata, file changes, and diff statistics—essential for thorough code investigation and debugging workflows. It serves both as extended functionality (enhancing core blame) and developer experience (improving productivity).

## Business Value

Developers frequently need to understand the complete context of a change, not just who made it and when. By providing comprehensive commit details directly in VS Code, this feature eliminates context switching to terminal windows, external git tools, or web-based repository viewers.

**Benefits**:
- **Accelerated debugging**: See all files changed in a commit to understand full impact
- **Reduced context switching**: No need to use terminal or GitLens for detailed investigation
- **Better code comprehension**: Understand the complete scope of changes alongside the code
- **Improved code review efficiency**: Quickly review related changes without external tools
- **Enhanced git workflow**: Seamless integration with existing VS Code development environment

## What It Does

When a developer needs detailed information about a commit (typically discovered through the git blame overlay), the Commit Details View feature allows them to:

1. Execute a "Show Commit Details" command on the current line
2. Retrieve comprehensive commit information via `git show <hash>` or `git log -1 <hash> --format=fuller`
3. Display detailed commit data in either:
   - **Quick Pick interface** (for lightweight, quick access)
   - **Editor tab/panel** (for detailed investigation with full diff)
4. View comprehensive commit information including:
   - Full commit message (not truncated)
   - Complete author information (name, email)
   - Committer information (if different from author)
   - Commit timestamp with full date and time
   - List of all files changed in the commit
   - Diff statistics (lines added/removed per file)
   - Optional: Full diff view for individual files

### User Experience

**Primary Workflow**:
1. User clicks a line of code to see git blame overlay
2. User wants more details about the commit
3. User runs "Show Commit Details" command (Command Palette or keybinding)
4. Extension extracts commit hash from current line's blame data
5. Quick Pick or panel appears with comprehensive commit information
6. User can optionally:
   - Navigate to specific changed files
   - View individual file diffs
   - Copy commit details
   - Open full diff in editor

**Alternative Entry Points**:
- Direct command execution with cursor on any line
- Context menu: "Show Commit Details for Line"
- Keyboard shortcut for quick access
- Integration with git blame overlay hover actions

### Example Output

**Quick Pick Format** (Simple View):
```
Commit: 25418bf3a8e9c12d45f6e78a9b01c23d45e67f89
Author: John Doe <john.doe@example.com>
Date: 2024-02-20 14:35:22 -0500
Committer: John Doe <john.doe@example.com>

Add comprehensive git blame support for VS Code

This commit implements the core git blame overlay feature,
including click-to-show functionality, configurable formatting,
and theme-aware styling.

Files Changed (3):
  src/extension.ts        | 145 ++++++++++++++++++++++++++++++++
  src/blameProvider.ts    | 89 +++++++++++++++++++
  src/overlayManager.ts   | 112 ++++++++++++++++++++++++

Total: 346 insertions(+), 0 deletions(-)

[View Full Diff] [View Files] [Copy Hash] [Close]
```

**Editor Tab Format** (Detailed View):
Opens a read-only editor tab with syntax-highlighted commit details, similar to `git show` output, with interactive file navigation.

## Key Features

### Core Functionality
- **Command-based activation**: Single command to show detailed commit information
- **Automatic hash extraction**: Retrieves commit hash from current line's blame data
- **Comprehensive metadata display**: Full author, committer, date, and message information
- **File change summary**: Lists all files modified in the commit
- **Diff statistics**: Shows lines added/removed per file
- **Multiple view modes**: Quick Pick for speed, Editor tab for detail

### Extended Capabilities
- **Interactive file navigation**: Click to view specific file changes
- **Individual file diffs**: Option to view diff for each changed file
- **Copy commit details**: Easy copying of commit hash, message, or full details
- **Commit hash validation**: Handles invalid or missing commit hashes gracefully
- **Support for uncommitted changes**: Shows appropriate message for unstaged/staged changes
- **Integration with blame overlay**: Seamless workflow from blame to detailed investigation

### Display Options
- **Quick Pick mode** (default): Fast, lightweight overlay for quick reference
- **Editor tab mode**: Full-featured view with syntax highlighting and scrolling
- **Panel mode** (future): Dedicated sidebar panel for persistent commit inspection

## Configuration

This feature will respect the following configuration options:

### Available Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `gitBlameOverlay.commitDetailsView` | string | `"quickpick"` | Display mode: `"quickpick"`, `"editor"`, or `"panel"` |
| `gitBlameOverlay.commitDetailsShowDiff` | boolean | `false` | Automatically show full diff in detailed view |
| `gitBlameOverlay.commitDetailsShowFileList` | boolean | `true` | Show list of changed files in commit |
| `gitBlameOverlay.commitDetailsShowStats` | boolean | `true` | Show diff statistics (lines added/removed) |
| `gitBlameOverlay.commitDetailsMaxFiles` | number | `50` | Maximum number of files to display in list |

### Configuration Examples

#### Example 1: Quick Pick Mode (Default)
```json
{
  "gitBlameOverlay.commitDetailsView": "quickpick",
  "gitBlameOverlay.commitDetailsShowFileList": true,
  "gitBlameOverlay.commitDetailsShowStats": true
}
```
**Result**: Shows commit details in a Quick Pick overlay with file list and statistics  
**Use case**: Fast access to commit information without opening new editor tabs

#### Example 2: Full Editor Mode with Diff
```json
{
  "gitBlameOverlay.commitDetailsView": "editor",
  "gitBlameOverlay.commitDetailsShowDiff": true,
  "gitBlameOverlay.commitDetailsShowFileList": true,
  "gitBlameOverlay.commitDetailsShowStats": true
}
```
**Result**: Opens detailed commit view in new editor tab with full diff included  
**Use case**: Thorough investigation requiring full context and diff review

#### Example 3: Minimal Quick View
```json
{
  "gitBlameOverlay.commitDetailsView": "quickpick",
  "gitBlameOverlay.commitDetailsShowFileList": false,
  "gitBlameOverlay.commitDetailsShowStats": false
}
```
**Result**: Shows only commit metadata (author, date, message) without file details  
**Use case**: Quick reference for commit message and author information only

### How to Apply Configuration

1. Open VS Code Settings (Cmd/Ctrl + ,)
2. Search for "Git Blame Overlay"
3. Locate "Commit Details View" settings
4. Adjust display mode and options as needed
5. Changes apply immediately to next command execution

## Technical Implementation

### Proposed Architecture

The feature will introduce new components while leveraging existing blame infrastructure:

```
User Action (Show Commit Details Command)
    ↓
CommitDetailsProvider
    ├─ Extract commit hash from BlameProvider
    ├─ Execute git show/log command
    └─ Parse commit metadata and file changes
    ↓
CommitDetailsView (Display Layer)
    ├─ QuickPickView (lightweight mode)
    ├─ EditorView (detailed mode)
    └─ PanelView (future - sidebar integration)
```

### Related Source Code

Proposed new files:
- **Commit Details Provider**: `src/commitDetailsProvider.ts` (new)
  - Executes git commands: `git show <hash>`, `git log -1 <hash> --format=fuller`
  - Parses commit metadata and diff statistics
  - Provides structured commit data to views
  
- **Commit Details View**: `src/commitDetailsView.ts` (new)
  - Creates Quick Pick or Editor tab presentations
  - Handles user interactions (file navigation, copy actions)
  - Formats commit data for display

- **Extension Integration**: `src/extension.ts` (modified)
  - Registers new command: `git-blame-vsc.showCommitDetails`
  - Coordinates between BlameProvider and CommitDetailsProvider
  - Manages configuration and view selection

Existing dependencies:
- **Blame Provider**: `src/blameProvider.ts`
  - Used to retrieve commit hash for current line
  
- **Configuration**: `package.json`
  - New configuration properties
  - Command registration

### Key Implementation Details

**CommitDetailsProvider**:
- Executes `git show <hash> --stat --format=fuller` to get comprehensive data
- Alternative: `git log -1 <hash> --format=fuller` for metadata + `git show --stat` for diffs
- Parses commit data into structured format:
  ```typescript
  interface CommitDetails {
    hash: string;
    hashFull: string;
    author: { name: string; email: string; };
    authorDate: string;
    committer: { name: string; email: string; };
    commitDate: string;
    message: string;
    messageBody?: string;
    files: Array<{
      path: string;
      insertions: number;
      deletions: number;
      status: 'modified' | 'added' | 'deleted' | 'renamed';
    }>;
    stats: {
      totalInsertions: number;
      totalDeletions: number;
      filesChanged: number;
    };
  }
  ```

**CommitDetailsView**:
- **Quick Pick Mode**: Uses `vscode.window.showQuickPick()` with custom items
  - Each item represents a section or action
  - Supports navigation to file diffs
  - Copy actions via item selection
  
- **Editor Mode**: Uses `vscode.workspace.openTextDocument()` with virtual URI
  - Creates read-only document with formatted commit details
  - Syntax highlighting using git diff language
  - Clickable file paths for navigation

**Error Handling**:
- Validates commit hash before execution
- Handles git command failures gracefully
- Shows appropriate messages for:
  - Uncommitted changes (no commit hash available)
  - Invalid or missing commit hashes
  - Repository errors or git unavailability
  - Large commits (>100 files) with truncation warning

### Performance Considerations

- **Caching**: Cache commit details for recently viewed commits (5-minute TTL)
- **Lazy loading**: Load full diff only when requested by user
- **Pagination**: Limit file list to configurable maximum (default 50 files)
- **Async execution**: Run git commands asynchronously to prevent UI blocking
- **Incremental parsing**: Stream large diff outputs instead of loading entirely

## User Interactions

### Primary Workflow
1. User clicks a line to show git blame overlay
2. User notices commit hash in overlay (e.g., `[25418bf]`)
3. User executes "Show Commit Details" command via:
   - Command Palette: "Git Blame: Show Commit Details"
   - Keyboard shortcut: `Ctrl/Cmd+Shift+G D`
   - Context menu (right-click): "Show Commit Details for Line"
4. Quick Pick or editor tab appears with comprehensive commit information
5. User reviews commit message, author, files changed
6. Optional: User clicks on a changed file to view its diff
7. Optional: User copies commit hash or details
8. User closes view or executes command on different line

### Alternative Workflows

**Direct Hash Input**:
- User runs command without blame overlay active
- Extension prompts for commit hash input
- Shows commit details for manually entered hash

**Navigate from Other Features**:
- Integration with future "File Blame Annotations" feature
- Context menu on git decorations or gutter icons
- Integration with "Rich Blame Hovers" for quick access

### Commands and Shortcuts

| Command | ID | Default Shortcut | Description |
|---------|----|----|-------------|
| Show Commit Details | `git-blame-vsc.showCommitDetails` | `Ctrl/Cmd+Shift+G D` | Show detailed commit info for current line |
| Show Commit Details (Input Hash) | `git-blame-vsc.showCommitDetailsInput` | None | Show commit details for manually entered hash |
| Copy Commit Hash | `git-blame-vsc.copyCommitHash` | None | Copy commit hash from current line to clipboard |
| View File Diff | `git-blame-vsc.viewFileDiff` | None | View diff for selected file in commit (from details view) |

## Status and Roadmap

### Current Status

- 🚧 **Planning Phase**: Feature specification complete
- 🚧 **Architecture Design**: Component design in progress
- ❌ **Implementation**: Not yet started
- ❌ **Testing**: Pending implementation
- ❌ **Documentation**: User-facing docs pending

### Known Limitations (Anticipated)

1. **Large commits**: Commits with >100 files may show truncated file lists with warning
2. **Performance**: Initial load may take 1-2 seconds for commits with extensive diffs
3. **Merge commits**: Merge commits show combined diff, may be verbose
4. **Repository requirements**: Requires git to be installed and accessible in PATH
5. **Single view**: Only one commit details view active at a time (Quick Pick mode)
6. **No diff navigation**: Initial version shows full diff without inline navigation tools
7. **Limited history**: No "previous/next commit" navigation from details view

### Planned Enhancements

#### Version 0.0.3 (Initial Implementation)
- [x] Command registration and basic flow
- [x] Commit details provider with git integration
- [x] Quick Pick view implementation
- [x] File list display with statistics
- [x] Configuration options for view mode
- [x] Error handling for edge cases

#### Version 0.0.4 (Enhanced Capabilities)
- [ ] Editor tab view mode with syntax highlighting
- [ ] Individual file diff viewing
- [ ] Copy commit hash/message actions
- [ ] Keyboard shortcuts and context menu integration
- [ ] Caching for performance optimization

#### Future Enhancements (Post v0.0.4)
- [ ] Dedicated sidebar panel for commit details
- [ ] Commit history navigation (previous/next in file)
- [ ] Inline diff viewer with side-by-side comparison
- [ ] Compare current file version with commit version
- [ ] Integration with VS Code's built-in git diff viewer
- [ ] "Show in GitHub/GitLab" button for web view
- [ ] Support for git worktrees and submodules
- [ ] Commit graph visualization showing file relationships
- [ ] Search/filter within changed files list
- [ ] Batch commit comparison (compare multiple commits)

## Integration Points

### Integration with Existing Features

**Git Blame Overlay** ([../git-blame-overlay/summary.md](../git-blame-overlay/summary.md)):
- Commit Details View extends the overlay by providing deep-dive investigation
- Commit hash from overlay is used as input for details command
- Workflow: Click line → See blame overlay → Show commit details

**Customizable Formatting** ([../customizable-formatting/summary.md](../customizable-formatting/summary.md)):
- Shares configuration namespace: `gitBlameOverlay.*`
- Commit details formatting may respect similar patterns in future

**Performance Optimization** ([../performance-optimization/summary.md](../performance-optimization/summary.md)):
- Leverages similar caching strategies for commit data
- May share cache implementation with BlameProvider

### Integration with Future Features

**Rich Blame Hovers** ([../rich-blame-hovers/summary.md](../rich-blame-hovers/summary.md)):
- Hover could include "Show Details" button/link
- Quick access to commit details from hover UI

**File Blame Annotations** ([../file-blame-annotations/summary.md](../file-blame-annotations/summary.md)):
- Gutter annotations could link directly to commit details
- Context menu on annotations: "Show Commit Details"

**Copy Commit Hash** ([../copy-commit-hash/summary.md](../copy-commit-hash/summary.md)):
- Shares commit hash extraction logic
- Both features work with same blame data

## Related Features

- [Git Blame Overlay](../git-blame-overlay/summary.md) - Core feature providing quick blame information
- [Rich Blame Hovers](../rich-blame-hovers/summary.md) - Hover-based blame information display
- [File Blame Annotations](../file-blame-annotations/summary.md) - Gutter annotations for all lines
- [Copy Commit Hash](../copy-commit-hash/summary.md) - Quick commit hash extraction
- [Performance Optimization](../performance-optimization/summary.md) - Caching and performance strategies

---

## Implementation Checklist

When implementing this feature, ensure:

- [ ] Command registration in `package.json`
- [ ] New configuration properties defined
- [ ] CommitDetailsProvider class created with git integration
- [ ] Quick Pick view implementation
- [ ] Error handling for all git operations
- [ ] Cache implementation for commit data (5-minute TTL)
- [ ] Integration with existing BlameProvider
- [ ] Unit tests for commit parsing
- [ ] Integration tests for command execution
- [ ] User documentation and examples
- [ ] Configuration documentation
- [ ] Keyboard shortcut defaults
- [ ] Context menu integration
- [ ] Performance benchmarks for large commits
- [ ] Accessibility review (keyboard navigation, screen readers)

---

**Estimated Effort**: 2-3 hours initial implementation (Quick Pick mode) + 2-3 hours for editor mode and enhancements

**Priority**: Medium - Enhances developer experience but not critical for core functionality

**Dependencies**: None (extends existing BlameProvider capabilities)
