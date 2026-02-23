# File Blame Annotations (Gutter) Feature

## Overview

The File Blame Annotations feature displays git blame information in the editor gutter for all lines in a file simultaneously, providing an at-a-glance view of file authorship and modification history.

## Status

- **Status**: 🚧 Planned (Not Yet Implemented)
- **Target Version**: 0.1.0
- **Estimated Effort**: 3-4 hours

## Feature Type

**Category**: Core Functionality + Extended Functionality  
**Type**: Enhanced visualization feature that extends git blame capabilities

This feature builds on the core git blame overlay by providing a file-wide view of blame information. While the line-by-line overlay (core functionality) answers "who changed this specific line?", gutter annotations answer "who changed what across this entire file?", making it an extended capability that enhances code comprehension and pattern recognition.

## Business Value

Developers can quickly identify code ownership patterns, collaboration hotspots, and modification history across an entire file without interacting with individual lines. This accelerates code review, onboarding, and understanding of legacy codebases.

**Benefits**:
- **Faster code review**: See entire file's authorship at once without clicking individual lines
- **Pattern recognition**: Identify collaboration boundaries and ownership zones visually
- **Improved onboarding**: New team members can quickly understand who owns which parts of a file
- **Historical context**: Visual heatmap of changes reveals file evolution and active development areas
- **Similar to industry tools**: Provides GitLens-style file annotations familiar to developers

## What It Does

When activated via command, the feature displays condensed git blame information in the editor gutter (left margin) for every line in the currently active file:

1. User executes "Show File Blame" command from Command Palette
2. Extension fetches blame data for entire file (leveraging existing cache)
3. Gutter decorations appear showing author, date, or commit hash for each line
4. User can view the entire file's authorship history at a glance
5. User executes "Hide File Blame" command to clear annotations

### User Experience

**Before activation:**
```
1  | function calculateTotal(items) {
2  |   return items.reduce((sum, item) => sum + item.price, 0);
3  | }
```

**After activation (example with author names):**
```
john    1  | function calculateTotal(items) {
sarah   2  |   return items.reduce((sum, item) => sum + item.price, 0);
john    3  | }
```

**Alternative display modes:**
- **Dates**: `2024-02-20 | function calculateTotal(items) {`
- **Hashes**: `25418bf | function calculateTotal(items) {`
- **Combined**: `john, 02-20 | function calculateTotal(items) {`

The annotations appear non-intrusively in the gutter, color-coded by author or recency for quick visual scanning.

## Key Features

### Core Functionality
- **Toggle commands**: "Show File Blame" and "Hide File Blame" for explicit control
- **Full file coverage**: Displays blame for every line simultaneously
- **Multiple display modes**: Choose between author names, dates, commit hashes, or combinations
- **Leverages existing cache**: Reuses BlameProvider's 30-second cache for performance

### Display Options
- **Condensed format**: Shows minimal but informative data (e.g., first name only, short dates)
- **Author names**: Display full name, short name, or initials
- **Dates**: Show full date (YYYY-MM-DD) or condensed format (MM-DD)
- **Commit hashes**: Display 7-character short hash
- **Custom patterns**: Configurable display format similar to outputPattern

### Visual Enhancements (Optional)
- **Color-coding by author**: Different colors for different contributors
- **Recency heatmap**: Fade older commits to highlight recent changes
- **Author grouping**: Visually distinguish consecutive lines by same author
- **Theme integration**: Automatic color adaptation to current VS Code theme

## Configuration

This feature will introduce new configuration options:

### Available Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `gitBlameOverlay.gutterAnnotations.enabled` | boolean | `false` | Enable gutter annotations by default on file open |
| `gitBlameOverlay.gutterAnnotations.displayMode` | string | `"author"` | What to display: `"author"`, `"date"`, `"hash"`, or `"authorDate"` |
| `gitBlameOverlay.gutterAnnotations.authorFormat` | string | `"short"` | Author display: `"full"`, `"short"`, or `"initials"` |
| `gitBlameOverlay.gutterAnnotations.dateFormat` | string | `"YYYY-MM-DD"` | Date format pattern |
| `gitBlameOverlay.gutterAnnotations.colorByAuthor` | boolean | `true` | Color-code annotations by author |
| `gitBlameOverlay.gutterAnnotations.fadeByAge` | boolean | `false` | Fade older commits (recency heatmap) |

### Configuration Examples

#### Example 1: Minimal Author Names
```json
{
  "gitBlameOverlay.gutterAnnotations.displayMode": "author",
  "gitBlameOverlay.gutterAnnotations.authorFormat": "short",
  "gitBlameOverlay.gutterAnnotations.colorByAuthor": true
}
```
**Result**: `john  | code here`  
**Use case**: Quick ownership identification with minimal visual noise

#### Example 2: Date-Focused View
```json
{
  "gitBlameOverlay.gutterAnnotations.displayMode": "date",
  "gitBlameOverlay.gutterAnnotations.dateFormat": "MM-DD",
  "gitBlameOverlay.gutterAnnotations.fadeByAge": true
}
```
**Result**: `02-20 | code here`  
**Use case**: Identify recently modified code sections

#### Example 3: Combined Information
```json
{
  "gitBlameOverlay.gutterAnnotations.displayMode": "authorDate",
  "gitBlameOverlay.gutterAnnotations.authorFormat": "initials",
  "gitBlameOverlay.gutterAnnotations.dateFormat": "MM-DD"
}
```
**Result**: `JD 02-20 | code here`  
**Use case**: Balance between detail and compactness

### How to Apply Configuration

1. Open VS Code Settings (Cmd/Ctrl + ,)
2. Search for "git blame gutter"
3. Adjust settings to preferred display mode
4. Toggle annotations on/off via Command Palette

## Technical Implementation

### Related Source Code
- **Blame Provider**: [src/blameProvider.ts](../../../src/blameProvider.ts) - Already caches full-file blame
- **Overlay Manager**: [src/overlayManager.ts](../../../src/overlayManager.ts) - Will need gutter decoration support
- **Extension Entry Point**: [src/extension.ts](../../../src/extension.ts) - Command registration

### Architecture Overview

```
User Command ("Show File Blame")
    ↓
Extension.ts (command handler)
    ↓
BlameProvider.getBlameOutput() ← Already has full-file cache!
    ↓
Parse all lines from blame output
    ↓
OverlayManager.showGutterAnnotations()
    ↓
Create gutter decorations for each line
    ↓
Render in editor gutter
```

### Key Implementation Details

#### Leveraging Existing Cache
The BlameProvider already fetches and caches full-file blame in `getBlameOutput()` ([src/blameProvider.ts:83-128](../../../src/blameProvider.ts#L83-L128)). This feature will:
- Call `getBlameOutput()` once for the entire file
- Parse all lines (not just one)
- Create gutter decorations for all lines simultaneously

#### Gutter Decorations
VS Code provides `gutterIconPath` and `gutterIconSize` in decoration options:
```typescript
const decorationType = vscode.window.createTextEditorDecorationType({
  isWholeLine: false,
  gutterIconPath: vscode.Uri.parse('data:image/svg+xml,...'), // SVG with text
  gutterIconSize: 'contain'
});
```

Alternative approach using `before` decoration:
```typescript
const decorationType = vscode.window.createTextEditorDecorationType({
  before: {
    contentText: 'john',
    color: '#888',
    margin: '0 1em 0 0'
  }
});
```

#### Performance Considerations
- **Batch decoration creation**: Create all decorations in single operation
- **Reuse cache**: BlameProvider's 30-second cache prevents redundant git calls
- **Lazy rendering**: Only render for visible lines (future optimization)
- **Efficient updates**: Update only changed lines when switching modes

#### Color Generation
For color-by-author feature:
```typescript
function getAuthorColor(authorName: string, theme: 'light' | 'dark'): string {
  const hash = hashString(authorName);
  const hue = hash % 360;
  const saturation = theme === 'dark' ? '60%' : '50%';
  const lightness = theme === 'dark' ? '70%' : '40%';
  return `hsl(${hue}, ${saturation}, ${lightness})`;
}
```

## User Interactions

### Primary Workflow
1. User opens a file in a git repository
2. User opens Command Palette (Cmd/Ctrl + Shift + P)
3. User types "Show File Blame" and executes command
4. Gutter annotations appear for all lines
5. User can change display mode via settings
6. User executes "Hide File Blame" to clear annotations

### Alternative Workflows
- **Auto-show on file open**: Enable `gutterAnnotations.enabled` for automatic display
- **Toggle with keybinding**: Assign keyboard shortcut to toggle command (future enhancement)
- **Switch modes**: Change `displayMode` setting while annotations are visible for instant update

### Commands

| Command | ID | Description |
|---------|----|----|
| Show File Blame | `git-blame-vsc.showFileBlame` | Display gutter annotations for all lines |
| Hide File Blame | `git-blame-vsc.hideFileBlame` | Remove gutter annotations |
| Toggle File Blame | `git-blame-vsc.toggleFileBlame` | Toggle annotations on/off |

## Status and Roadmap

### Current Status

- ❌ Not yet implemented (planned for v0.1.0)
- ✅ BlameProvider already supports full-file blame retrieval
- ✅ Caching infrastructure exists and can be reused
- ⚠️ OverlayManager needs extension for gutter decorations

### Known Limitations (Anticipated)

1. **Performance on very large files**: Files with 10,000+ lines may experience rendering lag
2. **Gutter space**: Limited horizontal space may truncate long author names
3. **Theme compatibility**: Custom color schemes may not work well with all themes
4. **Cache dependency**: Inherits 30-second cache limitation from BlameProvider
5. **No per-line customization**: All lines use same display mode (no mixed modes)

### Future Enhancements (Out of Scope)

#### Near-term (v0.1.1 - v0.2.0)
- [ ] Keyboard shortcut for toggle command
- [ ] Hover tooltip on gutter annotation (show full commit details)
- [ ] Click gutter annotation to show commit in diff view
- [ ] Configurable gutter width

#### Medium-term (v0.3.0+)
- [ ] Lazy rendering for large files (only visible lines)
- [ ] Inline diff preview on gutter hover
- [ ] Filter by author (show only specific contributor's lines)
- [ ] Time-range filtering (show changes from last week/month)

#### Long-term (Future)
- [ ] Blame history animation (visualize file evolution over time)
- [ ] Integration with git graph visualization
- [ ] Team collaboration metrics from blame data
- [ ] Export blame heatmap as image

## Related Features

- [Git Blame Overlay](../git-blame-overlay/summary.md) - Line-by-line click-based blame (core feature that this extends)
- [Customizable Formatting](../customizable-formatting/summary.md) - Pattern-based output formatting (inspiration for gutter format)
- [Performance Optimization](../performance-optimization/summary.md) - Caching system reused by this feature
- [Theme-Aware Styling](../theme-aware-styling/summary.md) - Color adaptation for gutter annotations

---

## Implementation Notes

### Comparison with GitLens

GitLens provides similar gutter annotations. This feature aims to be:
- **Lighter weight**: Minimal configuration, focused on essential use case
- **Fast**: Leverage existing cache, batch operations
- **Integrated**: Consistent with existing git-blame-vsc UX patterns

### Design Decisions

1. **Why toggle commands instead of auto-show?**
   - Prevents visual clutter for users who don't need it
   - Explicit user intent (less surprising)
   - Can still enable auto-show via configuration

2. **Why multiple display modes?**
   - Different workflows need different information (ownership vs. recency)
   - Screen real estate varies by user setup
   - Provides flexibility without overwhelming default experience

3. **Why reuse BlameProvider cache?**
   - Consistent performance characteristics
   - No duplicate git calls
   - Simple implementation (no new caching logic)
