Now I have enough context. Let me generate the `summary.md` content:

# Commit Details View

**Feature Type**: ⭐ Core Functionality | 👥 User Experience | 🛠️ Developer Experience

**Status**: Planned — Target Release: v0.3.0+  
**Extension Version**: Introduced after v0.2.1  
**Related Files**:
- `src/commitDetailsProvider.ts` *(planned)*
- `src/commitDetailsView.ts` *(planned)*
- `src/extension.ts` *(modification planned)*

---

## Overview

The **Commit Details View** feature gives developers comprehensive, in-editor access to full commit information directly from the Git Blame Overlay. Instead of switching to a terminal or an external git tool to run `git show` or `git log`, developers can invoke a single command and immediately see the full commit message, author details, file change summary, and diff statistics—all within VS Code.

This feature is a natural extension of the existing git blame overlay: where the overlay shows *who* changed a line and *when*, the Commit Details View answers *why* and *what else changed in that commit*.

---

## Business Value

### Why It Matters

- **Eliminates context switching**: Developers no longer need to leave VS Code, open a terminal, and manually run `git show <hash>` to understand the full scope of a change.
- **Accelerates debugging**: Seeing all files changed in a single commit immediately reveals the full impact of a change, helping developers isolate regressions or understand refactoring decisions.
- **Improves code comprehension**: Commit messages, bodies, and related file changes provide the historical reasoning that makes code easier to understand and maintain.
- **Enhances code review efficiency**: Reviewers can quickly check related commits without switching between tools.
- **Seamless developer workflow**: Keeps the entire investigation loop—blame → context → action—inside the editor.

### Target Users

- **Developers debugging regressions**: Quickly identify all files touched in a suspected commit.
- **Code reviewers**: Understand the full context of a change during review.
- **New team members**: Investigate historical decisions without leaving the editor.
- **Any developer using the Git Blame Overlay**: The feature is a direct follow-up action to the existing blame overlay.

---

## What It Does

### Core Workflow

**Before this feature:**
1. Click line → see blame overlay showing `[25418bf] Jane Smith (2024-02-20): Add blame support`
2. Open terminal
3. Run `git show 25418bf`
4. Review output in terminal
5. Switch back to VS Code

**With this feature:**
1. Click line → see blame overlay showing `[25418bf] Jane Smith (2024-02-20): Add blame support`
2. Run **"Git Blame: Show Commit Details"** command (`Ctrl/Cmd+Shift+G D`)
3. View comprehensive commit information in a Quick Pick panel or editor tab
4. Optionally navigate to changed files or copy the commit hash
5. Continue working

### Example Output (Quick Pick Mode)

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
  src/blameProvider.ts    |  89 +++++++++++++++++++
  src/overlayManager.ts   | 112 ++++++++++++++++++++++++

Total: 346 insertions(+), 0 deletions(-)

[View Full Diff] [View Files] [Copy Hash] [Close]
```

---

## Key Features

### Core Capabilities

| Capability | Description |
|---|---|
| **Command-based activation** | Triggered via Command Palette, keyboard shortcut, or context menu |
| **Automatic hash extraction** | Retrieves commit hash from the current line's blame data via `BlameProvider` |
| **Comprehensive metadata** | Full author, committer, dates, commit message, and message body |
| **File change summary** | Lists all files modified in the commit with per-file insertion/deletion counts |
| **Diff statistics** | Aggregated totals: files changed, lines inserted, lines deleted |
| **Dual view modes** | Quick Pick (lightweight, fast) or Editor tab (detailed, scrollable) |
| **Graceful error handling** | Handles invalid hashes, uncommitted lines, and missing git history |

### Extended Capabilities

| Capability | Description |
|---|---|
| **Interactive file navigation** | Click a changed file in the view to open its diff |
| **Individual file diffs** | View the diff for any specific file in the commit |
| **Copy commit details** | Copy commit hash, message, or full details to clipboard |
| **Manual hash input** | Enter any commit hash manually via `showCommitDetailsInput` command |
| **Uncommitted change support** | Shows appropriate message for lines with unstaged or staged changes |

---

## Configuration

The Commit Details View is configurable via VS Code settings under the `gitBlameOverlay` namespace.

### Available Options

| Setting | Type | Default | Description |
|---|---|---|---|
| `gitBlameOverlay.commitDetailsView` | `string` | `"quickpick"` | Display mode: `"quickpick"` or `"editor"` |
| `gitBlameOverlay.commitDetailsShowDiff` | `boolean` | `false` | Include full diff in the view |
| `gitBlameOverlay.commitDetailsShowFileList` | `boolean` | `true` | Show the list of files changed |
| `gitBlameOverlay.commitDetailsShowStats` | `boolean` | `true` | Show insertion/deletion statistics |
| `gitBlameOverlay.commitDetailsMaxFiles` | `number` | `50` | Maximum number of files to display |

### Configuration Examples

**Quick Pick Mode (Default — lightweight and fast):**
```json
{
  "gitBlameOverlay.commitDetailsView": "quickpick",
  "gitBlameOverlay.commitDetailsShowFileList": true,
  "gitBlameOverlay.commitDetailsShowStats": true
}
```

**Full Editor Mode with Diff (detailed investigation):**
```json
{
  "gitBlameOverlay.commitDetailsView": "editor",
  "gitBlameOverlay.commitDetailsShowDiff": true,
  "gitBlameOverlay.commitDetailsShowFileList": true,
  "gitBlameOverlay.commitDetailsShowStats": true
}
```

**Minimal Mode (hash, author, and message only):**
```json
{
  "gitBlameOverlay.commitDetailsView": "quickpick",
  "gitBlameOverlay.commitDetailsShowFileList": false,
  "gitBlameOverlay.commitDetailsShowStats": false,
  "gitBlameOverlay.commitDetailsShowDiff": false
}
```

---

## Technical Implementation

### Architecture

```
User Action (Show Commit Details Command)
    ↓
CommitDetailsProvider         [src/commitDetailsProvider.ts]
    ├─ Extract hash from BlameProvider
    ├─ Execute: git show <hash> --stat --format=fuller
    └─ Parse: CommitDetails interface
    ↓
CommitDetailsView              [src/commitDetailsView.ts]
    ├─ QuickPickView   (gitBlameOverlay.commitDetailsView = "quickpick")
    ├─ EditorView      (gitBlameOverlay.commitDetailsView = "editor")
    └─ PanelView       (future — sidebar integration)
    ↓
Command Registration           [src/extension.ts]
    ├─ git-blame-vsc.showCommitDetails
    ├─ git-blame-vsc.showCommitDetailsInput
    └─ git-blame-vsc.viewFileDiff
```

### Planned New Files

| File | Responsibility |
|---|---|
| `src/commitDetailsProvider.ts` | Executes `git show`/`git log` commands and parses commit metadata and file change data |
| `src/commitDetailsView.ts` | Creates and manages Quick Pick and Editor tab presentations of commit data |

### Modified Files

| File | Change |
|---|---|
| `src/extension.ts` | Register three new commands: `showCommitDetails`, `showCommitDetailsInput`, `viewFileDiff` |

### Git Commands Used

```bash
# Primary commit data with statistics
git show <hash> --stat --format=fuller

# Alternative: single commit log
git log -1 <hash> --format=fuller
```

### Core Data Structure

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

### Integration with `BlameProvider`

`CommitDetailsProvider` reads the commit hash for the current line from the existing `BlameProvider` ([`src/blameProvider.ts`](src/blameProvider.ts)), reusing hash extraction logic already shared with the `Copy Commit Hash` command. This avoids duplication and ensures consistent hash resolution across features.

---

## User Interactions

### Commands

| Command | ID | Shortcut | Activation |
|---|---|---|---|
| Show Commit Details | `git-blame-vsc.showCommitDetails` | `Ctrl/Cmd+Shift+G D` | Command Palette, keyboard shortcut, context menu |
| Show Commit Details (Input Hash) | `git-blame-vsc.showCommitDetailsInput` | *(none)* | Command Palette |
| View File Diff | `git-blame-vsc.viewFileDiff` | *(none)* | Interactive item inside the details view |

### Accessing the Feature

1. **Command Palette**: Open with `Ctrl/Cmd+Shift+P` → type `Git Blame: Show Commit Details`
2. **Keyboard shortcut**: `Ctrl/Cmd+Shift+G D` while cursor is on a blamed line
3. **Context menu**: Right-click in the editor → `Show Commit Details for Line`
4. **Manual hash**: Use `Git Blame: Show Commit Details (Input Hash)` to investigate any commit by hash

### Full User Workflow

1. Click or navigate to a line to trigger the git blame overlay
2. Observe the commit hash in the overlay (e.g., `[25418bf]`)
3. Execute **"Git Blame: Show Commit Details"** via any activation method
4. Review commit message, author, date, committer, and files changed
5. *(Optional)* Click a file in the list to open its specific diff
6. *(Optional)* Click **Copy Hash** to copy the commit hash to clipboard
7. Dismiss the view and continue working—no terminal required

---

## Status and Roadmap

### Current Status

**Not yet implemented.** This feature is planned for **v0.3.0+** of the Lightweight Git Blame Overlay extension (current version: v0.2.1).

- ✅ `BlameProvider` available for hash extraction ([`src/blameProvider.ts`](src/blameProvider.ts))
- ✅ `Copy Commit Hash` command already shares hash-extraction patterns ([`src/extension.ts`](src/extension.ts))
- ⬜ `CommitDetailsProvider` — not yet created
- ⬜ `CommitDetailsView` — not yet created
- ⬜ Command registration — not yet added to `package.json`
- ⬜ Configuration properties — not yet added to `package.json`

### Estimated Implementation Effort

| Component | Estimate |
|---|---|
| Quick Pick mode | 2–3 hours |
| Editor/tab mode | 2–3 hours |
| **Total** | **4–6 hours** |

### Known Limitations (Anticipated)

- **Large commits**: Commits with hundreds of files may render slowly in Quick Pick mode; `commitDetailsMaxFiles` setting mitigates this.
- **Shallow clones**: Repositories cloned with `--depth` may not have full commit history available.
- **Uncommitted lines**: Lines modified since the last commit show no associated hash; the view will display an appropriate message.
- **Binary files**: Binary file diffs will not be rendered in the editor view.
- **Detached HEAD state**: May affect hash resolution in some edge cases.

### Future Enhancements

| Enhancement | Priority | Notes |
|---|---|---|
| **Sidebar Panel view** | Medium | A dedicated sidebar panel for persistent commit investigation |
| **Hover integration** | Medium | Add a "Show Details" button/link inside the existing hover tooltip |
| **Gutter annotation links** | Low | Planned for the future File Blame Annotations feature |
| **Commit history navigation** | Low | Browse parent/child commits from the details view |
| **Copy full commit details** | Low | Copy the entire formatted commit summary as text |

---

## Related Features

| Feature | Relationship |
|---|---|
| [Git Blame Overlay](docs/features/git-blame-overlay/summary.md) | **Primary input source** — the commit hash shown in the overlay is the entry point for this feature |
| [Copy Commit Hash](docs/features/copy-commit-hash/summary.md) | **Shared logic** — both features extract commit hashes from `BlameProvider`; this feature extends that pattern |
| Rich Blame Hovers | **Future integration** — hover tooltips may include a "Show Details" action linking to this feature |
| File Blame Annotations *(planned)* | **Future integration** — gutter annotations may link to commit details |

---

## Feature Type Classification

**Primary**: ⭐ **Core Functionality** — This feature directly serves the primary purpose of the extension: enabling deep understanding of code history without leaving VS Code. It transforms the blame overlay from a passive annotation into an actionable investigation tool.

**Secondary**: 👥 **User Experience** — The dual-mode display (Quick Pick for speed, Editor tab for depth) and interactive navigation are explicitly designed to minimize friction and match different investigative needs.

**Secondary**: 🛠️ **Developer Experience** — Eliminating context switching to terminal tools and external git viewers is a direct productivity improvement for developers doing code archaeology, debugging, or review.

