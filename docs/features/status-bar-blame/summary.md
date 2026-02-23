# Status Bar Blame Feature

## Overview

The Status Bar Blame feature displays git blame information in the VS Code status bar for the currently selected line, providing always-visible context about code authorship without requiring clicks or manual interaction.

## Status

- **Status**: 🚧 Proposed (Not Yet Implemented)
- **Target Version**: 0.1.0
- **Effort Estimate**: 1-2 hours

## Feature Type

**Category**: Core Functionality / User Experience  
**Type**: Extended core functionality that enhances the primary git blame capability

This feature complements the existing click-to-show overlay by providing persistent, always-visible blame information in the status bar. While the overlay requires user interaction, this feature automatically updates as users navigate through code, reducing friction and cognitive load during code review and debugging workflows.

## Business Value

Developers frequently need context about code authorship while navigating files. Having blame information always visible in the status bar eliminates the need for repeated clicks, streamlining workflows and reducing interruptions during code review, debugging, and collaborative development.

**Benefits**:
- **Zero-friction access**: No clicks required - information updates automatically as cursor moves
- **Continuous visibility**: Always present without overlaying code or requiring UI space
- **Reduced cognitive load**: Less context switching between reading code and checking authorship
- **Familiar UX pattern**: Follows established VS Code patterns (similar to GitLens and other SCM extensions)
- **Complementary to overlay**: Users can choose their preferred interaction model or use both

## What It Does

When a user moves their cursor to any line in a git-tracked file, the VS Code status bar automatically displays blame information for that line. The information updates in real-time as the cursor moves, providing continuous context without manual interaction.

### User Experience

1. User opens a file in a git repository
2. User clicks or navigates to any line (arrow keys, search, etc.)
3. Status bar automatically updates to show blame information for the current line
4. Information refreshes instantly as user moves to different lines
5. Configuration option allows users to enable/disable the feature

### Example Output

**Status Bar Display:**
```
$(git-commit) 25418bf | John Doe | 2024-02-20 | Add git blame support
```

**Alternative Minimal Format:**
```
$(person) John | 2 days ago | Add git blame support
```

The status bar item appears alongside other status indicators (line/column number, file encoding, etc.), providing unobtrusive but readily accessible information.

## Key Features

### Core Functionality
- **Automatic updates**: Status bar refreshes on cursor movement (selection change)
- **Real-time display**: Leverages existing `BlameProvider` for consistent data
- **Configurable format**: Reuses existing `outputPattern` configuration system
- **Enable/disable toggle**: Configuration option to turn feature on/off

### Extended Capabilities
- **Clickable status bar item**: Click to show full commit details or open overlay
- **Theme-aware icons**: Uses VS Code's built-in icons (`$(git-commit)`, `$(person)`)
- **Performance optimization**: Shares blame cache with overlay feature (30-second TTL)
- **Graceful fallback**: Shows nothing for non-git files (no error messages)

## Configuration

This feature will respect existing configuration settings and introduce one new option:

### New Configuration Option

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gitBlameOverlay.statusBarEnabled` | Boolean | `false` | Enable/disable status bar blame display |

### Shared Configuration

The feature will reuse existing configuration options:

- **`gitBlameOverlay.outputPattern`**: Format template for status bar text
- **`gitBlameOverlay.maxMessageLength`**: Truncation length for commit messages

### Configuration Examples

#### Enable Status Bar Blame
```json
{
  "gitBlameOverlay.statusBarEnabled": true,
  "gitBlameOverlay.outputPattern": "[<hash>] <author> (<date>): <message>",
  "gitBlameOverlay.maxMessageLength": 24
}
```
**Result**: Status bar shows `[25418bf] John Doe (2024-02-20): Add git blame support`  
**Use case**: Users who want always-visible blame information

#### Minimal Status Bar Format
```json
{
  "gitBlameOverlay.statusBarEnabled": true,
  "gitBlameOverlay.outputPattern": "<authorShort> | <message>",
  "gitBlameOverlay.maxMessageLength": 30
}
```
**Result**: Status bar shows `John | Add git blame support`  
**Use case**: Users who prefer concise, unobtrusive display

#### Disable Status Bar (Default - Overlay Only)
```json
{
  "gitBlameOverlay.statusBarEnabled": false
}
```
**Result**: No status bar display; overlay still works on click  
**Use case**: Default setting; users who prefer manual, click-based blame viewing

### How to Apply Configuration

#### Via VS Code Settings UI
1. Open Settings (Cmd+, or Ctrl+,)
2. Search for "Git Blame Overlay"
3. Toggle "Status Bar Enabled" checkbox
4. Changes apply immediately

#### Via settings.json
```json
{
  "gitBlameOverlay.statusBarEnabled": true,
  "gitBlameOverlay.outputPattern": "<author>: <message>"
}
```

## Technical Implementation

### Related Source Code

**To Be Created:**
- **Status Bar Manager**: `src/statusBarManager.ts` (new file, ~80-100 lines)
  - Creates and manages status bar item
  - Updates text on selection change
  - Handles configuration changes
  - Manages item lifecycle

**To Be Modified:**
- **Extension Entry Point**: [`src/extension.ts`](../../../src/extension.ts)
  - Import and initialize `StatusBarManager`
  - Register selection change listener
  - Wire up configuration to status bar manager
  - Add disposal logic

**Existing Components (Reused):**
- **Blame Provider**: [`src/blameProvider.ts`](../../../src/blameProvider.ts)
  - Fetches git blame data (shared cache with overlay)
- **Format Function**: [`src/extension.ts:54-75`](../../../src/extension.ts#L54-L75)
  - `formatBlameText()` function reused for consistent formatting

### Architecture Overview

The feature integrates seamlessly with existing architecture:

```
User Moves Cursor
    ↓
onDidChangeTextEditorSelection event fires
    ↓
StatusBarManager receives event
    ↓
StatusBarManager calls BlameProvider.getBlameForLine()
    ↓
BlameProvider returns cached/fresh blame data
    ↓
StatusBarManager formats text via formatBlameText()
    ↓
StatusBarManager updates status bar item text
    ↓
User sees updated blame info in status bar
```

**Component Interaction:**
1. **Extension** - Coordinates between StatusBarManager and BlameProvider
2. **StatusBarManager** - Owns status bar item lifecycle and updates
3. **BlameProvider** - Provides blame data (shared with overlay feature)
4. **formatBlameText()** - Formats output (shared formatting logic)

### Key Implementation Details

**StatusBarManager Class:**
```typescript
export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private enabled: boolean;

  constructor(enabled: boolean) {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100 // Priority (position in status bar)
    );
    this.enabled = enabled;
    if (enabled) {
      this.statusBarItem.show();
    }
  }

  public updateBlameInfo(blameText: string): void {
    if (this.enabled) {
      this.statusBarItem.text = `$(git-commit) ${blameText}`;
      this.statusBarItem.tooltip = "Git Blame Information";
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled) {
      this.statusBarItem.show();
    } else {
      this.statusBarItem.hide();
    }
  }

  public dispose(): void {
    this.statusBarItem.dispose();
  }
}
```

**Integration in extension.ts:**
```typescript
// Initialize status bar manager
const config = vscode.workspace.getConfiguration('gitBlameOverlay');
const statusBarManager = new StatusBarManager(
  config.get('statusBarEnabled', false) // Default: false (disabled)
);

// Update status bar on selection change (reuse existing listener)
vscode.window.onDidChangeTextEditorSelection((event) => {
  const editor = event.textEditor;
  const line = editor.selection.active.line;

  if (blameProvider && editor.document.uri.scheme === 'file') {
    blameProvider.getBlameForLine(editor.document.fileName, line).then((blameInfo) => {
      if (blameInfo) {
        const blameText = formatBlameText(blameInfo);
        statusBarManager.updateBlameInfo(blameText);
      }
    });
  }
});
```

**Configuration Handling:**
- Add `statusBarEnabled` property to `package.json` contributions
- Read configuration in `activate()` function
- Listen for configuration changes via `onDidChangeConfiguration`
- Update `StatusBarManager` when configuration changes

## User Interactions

### Primary Workflow
1. User opens a file in a git repository
2. User navigates to any line (click, arrow keys, Ctrl+G, search, etc.)
3. Status bar automatically updates with blame information for that line
4. User continues navigating; status bar updates in real-time
5. User can click status bar item for additional actions (future enhancement)

### Alternative Workflows
- **Disable feature**: Toggle `statusBarEnabled` setting to `false`
- **Customize format**: Modify `outputPattern` to show desired information
- **Use alongside overlay**: Status bar provides quick reference; overlay provides detailed view on click

### Commands

No new commands required for v1. Status bar operates automatically.

**Future Enhancement:** Click status bar item to trigger actions:
- Show full commit details in hover
- Open commit in git history viewer
- Copy commit hash to clipboard

## Status and Roadmap

### Current Status

- ⬜ Not yet implemented (proposed for v0.1.0)
- ✅ Specification complete
- ✅ Architecture design complete
- ✅ Configuration schema defined

### Known Limitations

1. **Performance with large files**: Initial blame fetch may take a moment for very large files (mitigated by shared cache with overlay)
2. **Status bar space**: Adds another item to status bar; may compete with other extensions for space
3. **Single line display**: Shows blame for cursor line only, not selection ranges
4. **No click actions**: Initial version is display-only (no click interactions)
5. **Git dependency**: Requires git installed and accessible in system PATH

### Future Enhancements (Out of Scope - v0.1.0)

**v0.2.0 - Interactive Features:**
- [ ] Click status bar item to show full commit details in hover
- [ ] Click to open commit in source control view
- [ ] Copy commit hash on right-click
- [ ] Show commit diff on click

**v0.3.0 - Advanced Display:**
- [ ] Show blame for selection range (multi-line)
- [ ] Configurable status bar position (left/right)
- [ ] Configurable priority (position among other items)
- [ ] Relative date display ("2 days ago" vs "2024-02-20")
- [ ] Icon customization

**Future Considerations:**
- [ ] Show branch information in status bar
- [ ] Integration with VS Code timeline view
- [ ] Show uncommitted changes indicator
- [ ] Support for multiple cursors (show multiple blame entries)

## Related Features

- [Git Blame Overlay](../git-blame-overlay/summary.md) - Click-to-show overlay with detailed blame information (core feature)
- [Customizable Formatting](../customizable-formatting/summary.md) - Pattern-based formatting (shared with this feature)
- [Performance Optimization](../performance-optimization/summary.md) - Blame caching system (shared with this feature)
- [Theme-Aware Styling](../theme-aware-styling/summary.md) - Visual presentation patterns

---

## Implementation Notes

### Why This Feature Matters

The status bar blame feature addresses a common workflow inefficiency in the current extension. While the click-to-show overlay is useful for detailed inspection, developers often need quick reference information while navigating code. Having to click every line to see blame information creates friction, especially during:

- **Code review**: Understanding authorship while scanning through changes
- **Debugging**: Identifying when and by whom code was introduced
- **Onboarding**: Learning team coding patterns and ownership
- **Refactoring**: Checking change recency before modifications

### Comparison with Existing Overlay Feature

| Aspect | Click Overlay | Status Bar |
|--------|---------------|------------|
| **Activation** | Manual (click) | Automatic (cursor move) |
| **Visibility** | Inline, overlays code | Persistent, separate UI area |
| **Information Density** | High (can show more detail) | Low (space-constrained) |
| **Intrusiveness** | Medium (overlays code) | Low (dedicated UI space) |
| **Use Case** | Detailed inspection | Quick reference |
| **User Preference** | Deliberate action | Passive awareness |

Both features complement each other rather than compete. Users can:
- Use **status bar only** for minimal, always-visible info
- Use **overlay only** for deliberate, detailed inspection
- Use **both** for comprehensive blame awareness

### Design Decisions

**Why Status Bar vs. Inline Gutter?**
- Status bar is non-intrusive and doesn't modify editor layout
- Consistent with other VS Code extensions (GitLens, Git Graph)
- Easier to implement (no gutter decoration management)
- Familiar UX pattern for developers

**Why Reuse Formatting Configuration?**
- Consistent experience across overlay and status bar
- Single source of truth for output format
- Reduces configuration complexity
- Leverages existing user customization

**Why Default to Disabled?**
- Respects the extension's current philosophy of on-demand information display
- Keeps the UI minimal and unobtrusive by default
- Users who want always-visible blame can easily opt-in
- Avoids status bar clutter for users who prefer the click-based overlay
- Aligns with the lightweight nature of the extension

### Implementation Checklist

When implementing this feature:

- [ ] Create `src/statusBarManager.ts` with StatusBarManager class
- [ ] Add `statusBarEnabled` configuration to `package.json`
- [ ] Initialize StatusBarManager in `extension.ts:activate()`
- [ ] Wire selection change listener to update status bar
- [ ] Reuse existing `formatBlameText()` function
- [ ] Add configuration change listener for status bar settings
- [ ] Add disposal logic for status bar item
- [ ] Test with enabled/disabled configuration
- [ ] Test with various output patterns
- [ ] Test with non-git files (graceful fallback)
- [ ] Update README.md with status bar feature documentation
- [ ] Update CHANGELOG.md with new feature entry
- [ ] Add unit tests for StatusBarManager
- [ ] Verify performance with large files
- [ ] Test status bar positioning with other extensions
