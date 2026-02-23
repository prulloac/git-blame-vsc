# Copy Commit Hash to Clipboard Feature

## Overview

Provides a quick command to copy the git commit hash for the currently selected line to the system clipboard, streamlining developer workflows that involve referencing commits in git commands, GitHub URLs, or team communications.

## Status

- **Status**: ✅ Implemented (v0.2.0)
- **Version**: 0.2.0
- **Since**: v0.2.0

## Feature Type

**Category**: Developer Experience 🛠️ + User Experience 👥  
**Type**: Productivity enhancement for git-based workflows

This feature is primarily a **Developer Experience** improvement, as it targets developers who frequently need commit hashes for git operations, code reviews, and debugging. It's secondarily a **User Experience** enhancement because it reduces friction in common workflows by eliminating manual text selection and copying from the git blame overlay.

## Business Value

Developers frequently need commit hashes for various workflows: running git commands (`git show`, `git revert`), creating GitHub URLs, referencing commits in pull requests, or investigating code history. Currently, users must manually select and copy the hash from the blame overlay, which interrupts their flow.

**Benefits**:
- **Faster workflow execution**: Single command/shortcut copies hash instantly
- **Reduced cognitive load**: No need to precisely select text from overlay
- **Improved accuracy**: Eliminates risk of partial hash selection or typos
- **Enhanced git integration**: Seamless handoff to command-line git workflows
- **Better team collaboration**: Quick commit references for discussions and reviews

## What It Does

When a developer triggers the "Copy Commit Hash" command (via Command Palette or keyboard shortcut):

1. The extension identifies the currently selected line in the active editor
2. It queries the `BlameProvider` to get git blame information for that line
3. The commit hash is extracted from the blame data
4. The hash is copied to the system clipboard using VS Code's clipboard API
5. A confirmation message briefly appears to indicate success

### User Experience

The workflow is designed to be minimal and non-intrusive:

1. **Position cursor** on any line in a git-tracked file
2. **Trigger command** via:
   - Command Palette: `Copy Commit Hash`
   - Keyboard shortcut: None by default (user can configure their own)
3. **Receive confirmation**: Brief toast notification: "Commit hash copied: abc123f"
4. **Use hash immediately**: Paste into terminal, GitHub, or documentation

### Example Workflow

**Scenario**: Developer needs to investigate when a bug was introduced

```typescript
// User clicks on suspicious line:
const result = processData(input);

// Triggers "Copy Commit Hash" command
// → Notification: "Commit hash copied: 3a2b1c4"

// Pastes in terminal:
$ git show 3a2b1c4
$ git log 3a2b1c4 --oneline -5
```

**Before this feature**:
1. Click line to show overlay
2. Carefully select hash text from overlay (7 characters)
3. Copy with Ctrl+C
4. Switch to terminal
5. Paste hash

**After this feature**:
1. Click line
2. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Run "Copy Commit Hash"
4. Switch to terminal
5. Paste hash

## Key Features

### Core Functionality
- **Single-command copy**: One action copies hash to clipboard
- **Automatic line detection**: Uses current cursor position
- **Reuses existing infrastructure**: Leverages `BlameProvider.getBlameForLine()`
- **Clipboard integration**: Uses VS Code's native `vscode.env.clipboard.writeText()`

### User Feedback
- **Success confirmation**: Shows toast message with copied hash
- **Error handling**: Graceful fallback for non-git files or unavailable blame data
- **Non-blocking**: Async operation doesn't freeze UI

### Integration Points
- **Command Palette**: Discoverable via standard Command Palette search
- **Keyboard shortcut**: No default binding (users can configure their own via VS Code keybindings)
- **Context menu**: Not included by default to keep context menu clean

## Configuration

This feature requires minimal configuration as it leverages existing infrastructure.

### Available Options

No dedicated configuration settings are planned for v0.1.0. The feature will work with existing git-blame-vsc settings:

| Setting | Impact on Copy Hash Feature |
|---------|----------------------------|
| `gitBlameOverlay.outputPattern` | No direct impact (feature copies raw hash only) |
| `gitBlameOverlay.maxMessageLength` | No impact |

### Future Configuration Ideas (Out of Scope)

Potential future settings could include:

```json
{
  "gitBlameOverlay.copyCommitHashFormat": "short", // "short" (7 chars) or "full" (40 chars)
  "gitBlameOverlay.showCopyConfirmation": true,    // Show toast notification
  "gitBlameOverlay.copyHashPrefix": ""             // Optional prefix like "commit: "
}
```

## Technical Implementation

### Related Source Code

**Planned implementation locations**:
- **Command registration**: [src/extension.ts](../../../src/extension.ts#L95-L104) (add new command alongside `clearOverlay`)
- **Blame query logic**: [src/blameProvider.ts](../../../src/blameProvider.ts#L31-L78) (reuse `getBlameForLine()`)
- **Clipboard API**: VS Code built-in `vscode.env.clipboard.writeText()`

### Architecture Overview

The feature integrates seamlessly with existing components:

```
User Triggers Command
    ↓
Command Handler (extension.ts)
    ↓
Get Active Editor & Line Number
    ↓
BlameProvider.getBlameForLine(filePath, lineNumber)
    ↓
Extract hash from BlameInfo
    ↓
vscode.env.clipboard.writeText(hash)
    ↓
vscode.window.showInformationMessage("Commit hash copied: {hash}")
```

### Key Implementation Details

**Command Registration** (in `src/extension.ts`):
```typescript
const copyHashDisposable = vscode.commands.registerCommand(
  'git-blame-vsc.copyCommitHash',
  async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor');
      return;
    }

    const line = editor.selection.active.line;
    const filePath = editor.document.fileName;

    if (!blameProvider) {
      vscode.window.showWarningMessage('Git blame unavailable');
      return;
    }

    try {
      const blameInfo = await blameProvider.getBlameForLine(filePath, line);
      if (blameInfo && blameInfo.hash) {
        await vscode.env.clipboard.writeText(blameInfo.hash);
        vscode.window.showInformationMessage(
          `Commit hash copied: ${blameInfo.hash}`
        );
      } else {
        vscode.window.showWarningMessage('No git blame info for this line');
      }
    } catch (error) {
      vscode.window.showErrorMessage('Failed to copy commit hash');
      console.error('Error copying hash:', error);
    }
  }
);
```

**Package.json contribution**:
```json
{
  "contributes": {
    "commands": [
      {
        "command": "git-blame-vsc.copyCommitHash",
        "title": "Copy Commit Hash"
      }
    ]
  }
}
```

**Note**: No default keybindings or context menu items are provided. Users can add their own keybinding via VS Code's Keyboard Shortcuts settings (File > Preferences > Keyboard Shortcuts) by searching for "Copy Commit Hash" and assigning their preferred shortcut.

### Design Decisions

1. **Short hash by default**: Uses 7-character hash (matches `BlameProvider` behavior at [src/blameProvider.ts:214](../../../src/blameProvider.ts#L214))
2. **Async operation**: Command handler is async to handle blame queries gracefully
3. **No caching required**: Leverages `BlameProvider`'s existing 30-second cache
4. **Minimal error messages**: Shows warnings only when necessary, avoids noise for non-git files

## User Interactions

### Primary Workflow

**Command Palette Method** (primary method):
1. Position cursor on desired line
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Type "Copy Commit Hash"
4. Press Enter
5. See confirmation: "Commit hash copied: abc123f"
6. Paste hash wherever needed

**Custom Keyboard Shortcut Method** (if user configures one):
1. Position cursor on desired line
2. Press your configured shortcut (e.g., `Ctrl+Shift+C`)
3. See confirmation message
4. Paste hash wherever needed

### Alternative Workflows

**Copying multiple hashes sequentially**:
1. Click first line → Copy hash → Paste into notes
2. Click second line → Copy hash → Paste into notes
3. Repeat as needed

**Integration with git commands**:
```bash
# After copying hash with command:
$ git show <paste>
$ git log <paste> --oneline -10
$ git revert <paste>
```

### Commands and Shortcuts

| Command | ID | Default Shortcut | Location |
|---------|----|--------------------|----------|
| Copy Commit Hash | `git-blame-vsc.copyCommitHash` | None (user-configurable) | Command Palette |

**To add a custom keyboard shortcut**:
1. Open Keyboard Shortcuts (`Ctrl+K Ctrl+S` / `Cmd+K Cmd+S`)
2. Search for "Copy Commit Hash"
3. Click the `+` icon to add a keybinding
4. Enter your preferred shortcut (e.g., `Ctrl+Shift+C`)

## Status and Roadmap

### Current Status

**Proposed Feature** - Not yet implemented

**Estimated Implementation Effort**: 30 minutes - 1 hour

**Implementation complexity**: Low
- Reuses existing `BlameProvider` infrastructure
- Minimal new code required
- No new dependencies needed
- Straightforward VS Code API usage

### Known Limitations

1. **Single hash only**: Cannot copy multiple hashes at once (would need selection range support)
2. **Short hash format**: Initial version uses 7-character hash (no full 40-char option)
3. **No hash history**: Does not maintain clipboard history of copied hashes
4. **Requires active editor**: Command only works when editor is focused on a file
5. **Git dependency**: Requires git to be installed and file to be in a git repository

### Future Enhancements (Out of Scope - v0.1.0)

#### Short-term (v0.2.0+)
- [ ] **Configuration for hash format**: Choose between short (7 chars) or full (40 chars) hash
- [ ] **Copy full commit info**: Option to copy formatted commit info (hash + author + date)
- [ ] **Multiple hash selection**: Support for copying hashes for selected line range
- [ ] **Context menu integration**: Optional right-click menu item (if user demand exists)
- [ ] **Keyboard shortcut suggestion**: Recommend (but don't default) a keybinding in documentation

#### Medium-term (v0.3.0+)
- [ ] **Hash history panel**: Dedicated view showing recently copied hashes
- [ ] **GitHub URL integration**: Command to copy GitHub commit URL instead of hash
- [ ] **Copy commit message with hash**: Include both hash and message in clipboard
- [ ] **Smart paste templates**: Copy as formatted markdown link or HTML

#### Long-term (Future Versions)
- [ ] **Multi-repository support**: Handle copying from different repos with context
- [ ] **Commit comparison**: Copy hashes from two lines for quick diffing
- [ ] **Integration with PR templates**: Auto-insert commit references in PR descriptions
- [ ] **Blame history navigation**: Copy hash from previous commits for the same line

## Related Features

- [Git Blame Overlay](../git-blame-overlay/summary.md) - Core feature providing blame information (prerequisite)
- [Customizable Formatting](../customizable-formatting/summary.md) - Controls how blame data is displayed (related pattern)
- [Overlay Management](../overlay-management/summary.md) - Manages overlay lifecycle (shares infrastructure)

---

## Implementation Checklist

When implementing this feature, ensure:

- [ ] Command registered in `package.json` contributions
- [ ] Command handler implemented in `src/extension.ts`
- [ ] **No default keybindings** (keeps extension minimal and conflict-free)
- [ ] **No context menu items** (keeps right-click menu clean)
- [ ] Error handling for non-git files and unavailable blame data
- [ ] Success notification shows copied hash preview
- [ ] Command works with existing `BlameProvider` cache
- [ ] Unit tests for command handler logic
- [ ] Documentation updated in README.md with instructions on how to add custom keybinding
- [ ] CHANGELOG.md entry for new feature

## Technical Notes for Developers

### Reusing BlameProvider

The existing `BlameProvider.getBlameForLine()` method ([src/blameProvider.ts:31](../../../src/blameProvider.ts#L31)) returns a `BlameInfo` object with this structure:

```typescript
interface BlameInfo {
  hash: string;          // Already shortened to 7 chars
  author: string;
  authorEmail: string;
  authorShort: string;
  date: string;
  message: string;
  lineNumber: number;
}
```

The `hash` field is already formatted as a 7-character short hash (line 214), perfect for copying.

### Clipboard API

VS Code's clipboard API is straightforward:

```typescript
await vscode.env.clipboard.writeText(textToCopy);
```

This API:
- Works across all platforms (Windows, macOS, Linux)
- Handles clipboard permissions automatically
- Integrates with system clipboard (works with Ctrl+V / Cmd+V)
- Returns a Promise for async handling

### Testing Considerations

**Manual Testing**:
1. Test in git repository files
2. Test in non-git files (should show warning)
3. Test with Command Palette
4. Test with custom keybinding (if user adds one)
5. Verify clipboard content after copy
6. Test paste in various applications (terminal, browser, text editor)

**Unit Testing**:
- Mock `vscode.window.activeTextEditor`
- Mock `BlameProvider.getBlameForLine()`
- Verify `clipboard.writeText()` called with correct hash
- Test error handling for null blame info
- Test warning messages for edge cases
