# File Blame Annotations (Gutter Display)

## Overview

| Property | Value |
|----------|-------|
| **Feature Name** | File Blame Annotations (Gutter Display) |
| **Status** | ✅ Implemented |
| **Target Version** | v0.3.0 |
| **Current Version** | v0.3.0 |
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

When activated, the extension decorates every line of the active editor with a compact blame annotation in the gutter. Each annotation shows the author's name (configurable as initials, full name, or email) so developers can scan the entire file's authorship in a single glance.

**Before activation:**
```
1  | function calculateTotal(items) {
2  |   return items.reduce((sum, item) => sum + item.price, 0);
3  | }
```

**After activation (default: email):**
```
john@example…  1  | function calculateTotal(items) {
sarah@corp…    2  |   return items.reduce((sum, item) => sum + item.price, 0);
john@example…  3  | }
```

### User Experience

1. Open any file tracked by git.
2. Run **Git Blame: Show File Blame** from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
3. Gutter annotations appear instantly for all lines, using cached blame data when available.
4. Navigate the file normally — annotations stay in place.
5. Run **Git Blame: Hide File Blame** or **Git Blame: Toggle File Blame** to dismiss.

Annotations use `editorCodeLens.foreground` for text color and `editorGutter.background` for background, adapting automatically to the active VS Code theme.

---

## Key Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **Toggle commands** | `showFileBlame`, `hideFileBlame`, and `toggleFileBlame` for explicit and keyboard-shortcut-friendly control |
| **Full-file coverage** | Decorates every line in a single batch VS Code decoration call |
| **Cache reuse** | Reuses `BlameProvider`'s 30-second full-file blame cache — no redundant `git blame` processes |
| **Author display** | Author identity rendered in a fixed-width gutter column (12 characters), configurable as initials, full name, or email |
| **Debounced refresh** | Annotations are refreshed 300 ms after a text-document change, preventing excessive re-renders during typing |

### Display Format Options

| Option | Values | Example Output |
|--------|--------|----------------|
| **Author format** | `initials` \| `fullName` \| `email` | `JD` / `John Doe` / `john@example.com` |

### Extended Functionality

- Works alongside (and independently from) the existing single-line inline overlay.
- Annotations are cleared automatically when switching to another editor (stale decorations are removed from the previous editor).
- Annotations are refreshed automatically when the file is saved (cache is invalidated first so fresh `git blame` data is fetched).
- Gracefully handles uncommitted lines (e.g., new unsaved content) without error — those lines receive an empty gutter placeholder.

---

## Configuration

All gutter annotation settings live under the `gitBlameOverlay` namespace in workspace or user `settings.json`.

```json
{
  "gitBlameOverlay.gutterEnabled": false,
  "gitBlameOverlay.gutterAuthorFormat": "email"
}
```

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `gitBlameOverlay.gutterEnabled` | `boolean` | `false` | Show gutter annotations automatically on file open |
| `gitBlameOverlay.gutterAuthorFormat` | `"initials" \| "fullName" \| "email"` | `"email"` | How to format the author identity in the gutter |

> **Tip**: The `initials` format produces the most compact annotations (e.g. `JD`), while `email` is the most precise identifier. Annotations are always padded or truncated to a fixed 12-character width so columns stay aligned.

---

## Technical Implementation

### Architecture Overview

The feature extends two existing modules without breaking their current responsibilities:

```
extension.ts          ← registers showFileBlame / hideFileBlame / toggleFileBlame commands
     │
     └──► GutterAnnotationManager (new)
               │
               ├──► BlameProvider.getBlameForFile()  ← reuses existing 30-sec cache
               └──► vscode.TextEditorDecorationType  ← batch-sets decorations for all lines
```

### Key Source Files

| File | Role |
|------|------|
| [`src/extension.ts`](../../src/extension.ts) | Command registration, activation, and config change handler (`onDidChangeConfiguration` → `updateConfig()`) |
| [`src/blameProvider.ts`](../../src/blameProvider.ts) | Full-file `git blame` output + 30 s cache (`getBlameForFile()`) |
| [`src/gutterAnnotationManager.ts`](../../src/gutterAnnotationManager.ts) | Batch gutter decoration lifecycle: show/hide/toggle, debounced refresh, editor-switch cleanup |

### Implementation Notes

- **Decoration strategy**: Uses VS Code's `before` content decoration with `rangeBehavior: ClosedClosed` to anchor each annotation to its line. A separate `emptyDecorationType` fills gutter space for lines without blame data, keeping alignment consistent.
- **Batch operation**: Calls `editor.setDecorations(decorationType, allLineDecorations)` once per activation — avoids per-line overhead.
- **Author format**: Annotations are always padded or truncated to a fixed 12-character gutter width (`GUTTER_WIDTH = 12`). Text longer than 12 characters is truncated with a `…` suffix.
- **Debounce**: Text-document change events are debounced at 300 ms (`DEBOUNCE_DELAY_MS`) to avoid per-keystroke re-renders.
- **Cache invalidation**: On file save, `BlameProvider.invalidateFile()` is called so the next refresh fetches fresh `git blame` output.

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

