Now I have enough context to write the comprehensive `summary.md`. Here it is:

---

# File Blame Annotations (Gutter Display)

## Overview

| Property | Value |
|----------|-------|
| **Feature Name** | File Blame Annotations (Gutter Display) |
| **Status** | 📋 Planned |
| **Target Version** | v0.3.0 |
| **Current Version** | v0.2.1 |
| **Feature Type** | ⭐ Core Functionality · 🎨 Customization · 👥 User Experience |
| **Related Feature** | [Git Blame Overlay](../git-blame-overlay/summary.md) |

Gutter annotations extend the existing single-line git blame overlay by displaying blame information for **every line in a file simultaneously**. Instead of clicking or hovering on individual lines, developers get an at-a-glance, full-file view of authorship and modification history rendered in the editor's left margin (gutter).

---

## Business Value

Modern development teams work with large, long-lived codebases where understanding *who changed what, and when* is critical for:

- **Code review efficiency**: Reviewers can immediately identify which lines belong to which contributor without switching tools or running blame commands manually.
- **Onboarding acceleration**: New team members can visually map code ownership, understand responsibility boundaries, and find the right person to ask questions of.
- **Legacy code comprehension**: Quickly surface which sections of a file have been untouched for years vs. recently refactored.
- **Collaboration awareness**: Identify "hotspots" where multiple contributors have worked, signalling areas of shared concern or potential conflict.
- **Familiar developer UX**: Mirrors the gutter annotation style popularised by GitLens, lowering the learning curve for developers already familiar with that workflow.

---

## What It Does

### Core Behavior

When activated, the extension decorates every line of the active editor with a compact blame annotation in the gutter. Each annotation shows configurable information (author, date, commit hash, or combinations) so developers can scan the entire file's history in a single glance.

**Before activation:**
```
1  | function calculateTotal(items) {
2  |   return items.reduce((sum, item) => sum + item.price, 0);
3  | }
```

**After activation (default: author short-name):**
```
john    1  | function calculateTotal(items) {
sarah   2  |   return items.reduce((sum, item) => sum + item.price, 0);
john    3  | }
```

### User Experience

1. Open any file tracked by git.
2. Run **Git Blame: Show File Blame** from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
3. Gutter annotations appear instantly for all lines, using cached blame data when available.
4. Navigate the file normally — annotations stay in place.
5. Run **Git Blame: Hide File Blame** or **Git Blame: Toggle File Blame** to dismiss.

Annotations adapt to the current VS Code theme automatically and respect the extension's existing opacity, color, and font-weight settings.

---

## Key Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **Toggle commands** | `showFileBlame`, `hideFileBlame`, and `toggleFileBlame` for explicit and keyboard-shortcut-friendly control |
| **Full-file coverage** | Decorates every line in a single batch VS Code decoration call |
| **Cache reuse** | Reuses `BlameProvider`'s 30-second full-file blame cache — no redundant `git blame` processes |
| **Multiple display modes** | Author names, dates, commit hashes, or any combination via a configurable pattern |

### Display Format Options

| Option | Values | Example Output |
|--------|--------|----------------|
| **Author format** | `full`, `short`, `initials` | `Jonathan Smith` / `j.smith` / `JS` |
| **Date format** | `YYYY-MM-DD`, `MM-DD` | `2024-03-15` / `03-15` |
| **Commit hash** | 7-character short hash | `a1b2c3d` |
| **Custom pattern** | Configurable string | `a1b2c3d · j.smith` |

### Visual Enhancements (Optional)

| Enhancement | Description |
|-------------|-------------|
| **Color-coding by author** | Each contributor receives a distinct gutter color, making contribution zones instantly recognisable |
| **Recency heatmap** | Older commits fade out; recent commits appear more prominently, revealing the file's evolution at a glance |
| **Theme integration** | Colors are derived from the active VS Code theme to avoid visual clashes |

### Extended Functionality

- Works alongside (and independently from) the existing single-line inline overlay.
- Annotations are cleared automatically when the file is closed or the workspace changes.
- Gracefully handles uncommitted lines (e.g., new unsaved content) without error.

---

## Configuration

All settings live under the `gitBlameOverlay.gutterAnnotations` namespace and can be placed in workspace or user `settings.json`.

```json
{
  "gitBlameOverlay.gutterAnnotations.enabled": false,
  "gitBlameOverlay.gutterAnnotations.displayMode": "author",
  "gitBlameOverlay.gutterAnnotations.authorFormat": "short",
  "gitBlameOverlay.gutterAnnotations.dateFormat": "YYYY-MM-DD",
  "gitBlameOverlay.gutterAnnotations.colorByAuthor": true,
  "gitBlameOverlay.gutterAnnotations.fadeByAge": false
}
```

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Show gutter annotations automatically on file open |
| `displayMode` | `"author" \| "date" \| "hash" \| "custom"` | `"author"` | What information to show in the gutter |
| `authorFormat` | `"full" \| "short" \| "initials"` | `"short"` | How to format the author name |
| `dateFormat` | `"YYYY-MM-DD" \| "MM-DD"` | `"YYYY-MM-DD"` | Date display format |
| `colorByAuthor` | `boolean` | `true` | Assign unique colors per contributor |
| `fadeByAge` | `boolean` | `false` | Fade older commits for a recency heatmap effect |

> **Tip**: Combine `displayMode: "custom"` with the existing `gitBlameOverlay.outputPattern` variables (`<hash>`, `<author>`, `<date>`) for fully bespoke gutter text.

---

## Technical Implementation

### Architecture Overview

The feature extends two existing modules without breaking their current responsibilities:

```
extension.ts          ← registers showFileBlame / hideFileBlame / toggleFileBlame commands
     │
     └──► GutterAnnotationManager (new)
               │
               ├──► BlameProvider.getBlameOutput()   ← reuses existing 30-sec cache
               └──► vscode.TextEditorDecorationType  ← batch-sets decorations for all lines
```

### Key Source Files

| File | Role | Change Required |
|------|------|-----------------|
| [`src/extension.ts`](../../src/extension.ts) | Command registration and activation | Register three new commands |
| [`src/blameProvider.ts`](../../src/blameProvider.ts) | Full-file `git blame` output + 30s cache | No changes needed — already exposes `getBlameOutput()` |
| [`src/overlayManager.ts`](../../src/overlayManager.ts) | Single-line inline decoration management | Minor: export decoration helpers or serve as reference |
| `src/gutterAnnotationManager.ts` *(new)* | Batch gutter decoration lifecycle management | New file |

### Implementation Notes

- **Decoration strategy**: Use VS Code's `before` content decoration option (or `gutterIconPath` for icon-based annotations) with `rangeBehavior: ClosedClosed` to anchor decorations to each line.
- **Batch operation**: Call `editor.setDecorations(decorationType, allLineDecorations)` once per activation — avoids per-line overhead.
- **Author color mapping**: Maintain a `Map<string, string>` of `authorName → cssColor` seeded from a fixed accessible palette; persist across toggle cycles within a session.
- **Heatmap calculation**: Normalise commit timestamps across the file to a 0–1 opacity scale before applying decorations.
- **Estimated effort**: 3–4 hours.

---

## User Interactions

### Commands

| Command ID | Title | Description |
|------------|-------|-------------|
| `git-blame-vsc.showFileBlame` | **Git Blame: Show File Blame** | Display gutter annotations for all lines in the active editor |
| `git-blame-vsc.hideFileBlame` | **Git Blame: Hide File Blame** | Remove all gutter annotations from the active editor |
| `git-blame-vsc.toggleFileBlame` | **Git Blame: Toggle File Blame** | Toggle gutter annotations on/off |

### Typical Workflow

```
Open file in editor
  → Cmd+Shift+P → "Git Blame: Show File Blame"
  → Scan gutter for authorship patterns
  → Click a line to see full commit details (existing inline overlay)
  → Cmd+Shift+P → "Git Blame: Hide File Blame" (or re-toggle)
```

### Keyboard Shortcut (Recommended Binding)

Users can bind `git-blame-vsc.toggleFileBlame` to a custom keybinding in `keybindings.json`:

```json
{
  "key": "ctrl+shift+g b",
  "command": "git-blame-vsc.toggleFileBlame",
  "when": "editorTextFocus"
}
```

---

## Status and Roadmap

### Current Status

| Aspect | Status |
|--------|--------|
| Core toggle commands | ✅ Implemented |
| Author display mode | ✅ Implemented |
| Date / hash display modes | 📋 Planned |
| Color-by-author | 📋 Planned |
| Recency heatmap | 📋 Planned (optional) |
| Theme integration | 📋 Planned (optional) |

### Known Limitations

- **Binary / generated files**: `git blame` may be slow or unavailable for large binary-adjacent files; annotations will silently not appear.
- **Uncommitted lines**: Lines not yet committed (new content in a dirty file) will not receive a blame annotation.
- **Performance on very large files**: Files with thousands of lines will create thousands of decoration ranges; initial render may be briefly perceptible. Caching mitigates repeat cost.
- **No per-line drill-down from gutter**: Clicking a gutter annotation does not open a commit detail view in v0.3.0; users must click the line body to trigger the existing inline overlay.

### Future Enhancements

| Enhancement | Priority | Notes |
|-------------|----------|-------|
| Clickable gutter annotations opening commit diff | Medium | Requires VS Code webview or external diff integration |
| Inline summary bar (% of file by author) | Low | Useful for large-file ownership reporting |
| Persistent annotations across editor reloads | Low | Requires state serialisation |
| Support for multiple editors simultaneously | Medium | Track decoration state per `TextEditor` instance |
| Integration with VS Code's native SCM gutter | Low | Investigate `SourceControlResourceDecorations` API |

---

## Related Features

| Feature | Relationship |
|---------|--------------|
| [Git Blame Overlay](../git-blame-overlay/summary.md) | **Parent feature** — this extends the single-line inline overlay to full-file gutter coverage |
| [Performance Optimization](../performance-optimization/summary.md) | **Dependency** — the 30-second `BlameProvider` cache is the performance foundation for gutter annotations |
| Output Pattern Customization | **Sibling** — the existing `gitBlameOverlay.outputPattern` system provides the template syntax reused by `displayMode: "custom"` |

