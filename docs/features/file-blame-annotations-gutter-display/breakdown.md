# Feature Breakdown: File Blame Annotations (Gutter Display)

## 1. Executive Summary

**Feature Name:** File Blame Annotations (Gutter Display)
**Goal:** Display git blame information (author, date, etc.) in the editor gutter for every line of the active file.
**Value:** Allows developers to quickly understand code ownership and history without per-line interaction, improving code review and onboarding efficiency.
**Success Criteria:**
- Users can toggle gutter annotations on/off.
- Annotations show correct blame info for all lines.
- Annotations respect configuration (display mode, format).
- Performance is acceptable (uses caching).
- Visuals integrate well with VS Code themes.

## 2. Component Architecture

```
extension.ts
  │
  ├── registers commands (show/hide/toggle)
  │
  └──► GutterAnnotationManager (Singleton/Class)
         │
         ├──► BlameProvider (Dependency)
         │      └── returns blame data (cached)
         │
         ├──► Configuration (vscode.workspace.getConfiguration)
         │
         └──► vscode.window (TextEditor decoration API)
                └── applies decorations
```

**Components:**
1.  **GutterAnnotationManager**: Orchestrates the fetching of blame data, formatting, and rendering of decorations. Handles lifecycle events (active editor change, config change).
2.  **Extension Entry Point**: `src/extension.ts` registers the new commands and initializes the manager.
3.  **BlameProvider**: Existing component used to fetch git blame data.
4.  **VS Code API**: Used for commands, configuration, and editor decorations.

## 3. Implementation Tasks

### Task 1: Scaffolding and Configuration
**Component**: Extension Registration / Configuration
**Description**: Define the configuration schema in `package.json` and create the `GutterAnnotationManager` class structure.
**Dependencies**: None
**Acceptance Criteria**:
- [ ] `package.json` contains `gitBlameOverlay.gutterAnnotations` settings (enabled, displayMode, authorFormat, dateFormat, colorByAuthor).
- [ ] `src/gutterAnnotationManager.ts` exists with a basic class structure.
- [ ] Configuration can be read programmatically.
**Estimated Effort**: Small

### Task 2: Command Registration
**Component**: Extension Entry Point
**Description**: Register `showFileBlame`, `hideFileBlame`, and `toggleFileBlame` commands in `package.json` and `src/extension.ts`. Connect them to the manager stubs.
**Dependencies**: Task 1
**Acceptance Criteria**:
- [ ] Commands appear in the Command Palette.
- [ ] Commands trigger the corresponding methods in `GutterAnnotationManager`.
- [ ] Keybinding (Ctrl+Shift+G B) is suggested/documented (or registered if default).
**Estimated Effort**: Small

### Task 3: Blame Data Integration
**Component**: GutterAnnotationManager
**Description**: Implement the logic to retrieve blame data using `BlameProvider.getBlameOutput`.
**Dependencies**: Task 1
**Acceptance Criteria**:
- [ ] `GutterAnnotationManager` can access an instance of `BlameProvider`.
- [ ] calling `show` retrieves blame data for the active document.
- [ ] Data is retrieved from the cache if available.
**Estimated Effort**: Medium

### Task 4: Annotation Formatting Logic
**Component**: GutterAnnotationManager
**Description**: Implement logic to format blame data (author, date, hash) based on configuration settings.
**Dependencies**: Task 3
**Acceptance Criteria**:
- [ ] Author names are formatted correctly (full, short, initials).
- [ ] Dates are formatted correctly (YYYY-MM-DD, MM-DD).
- [ ] Custom patterns are supported (optional, but good to have structure for).
**Estimated Effort**: Medium

### Task 5: Decoration Rendering (Core)
**Component**: GutterAnnotationManager
**Description**: Implement the creation of `vscode.TextEditorDecorationType` and the generation of `vscode.DecorationOptions` for each line. Apply them to the editor.
**Dependencies**: Task 4
**Acceptance Criteria**:
- [ ] Annotations appear in the gutter (using `before` or `gutterIconPath` approach - likely `before` content).
- [ ] Annotations are aligned with the correct lines.
- [ ] "Hide" command clears the decorations.
**Estimated Effort**: Medium

### Task 6: Author Color Coding
**Component**: GutterAnnotationManager
**Description**: Implement logic to assign distinct colors to different authors.
**Dependencies**: Task 5
**Acceptance Criteria**:
- [ ] Different authors have distinguishable colors.
- [ ] Colors are consistent for the same author within the session.
- [ ] Colors contrast well with the editor background (basic check).
**Estimated Effort**: Small

### Task 7: Event Handling
**Component**: GutterAnnotationManager
**Description**: Handle `onDidChangeActiveTextEditor`, `onDidCloseTextEditor`, and configuration changes.
**Dependencies**: Task 5
**Acceptance Criteria**:
- [ ] Annotations update or clear when switching files.
- [ ] Annotations are removed when the file is closed.
- [ ] Changing settings (e.g., date format) updates the view immediately if active.
**Estimated Effort**: Medium

## 4. Acceptance Criteria Reference

| Task | Description | Criteria Summary |
|------|-------------|------------------|
| 1 | Scaffolding | Schema in package.json, Class created |
| 2 | Commands | Commands registered & linked |
| 3 | Blame Data | Data retrieved via BlameProvider |
| 4 | Formatting | Author/Date formats respected |
| 5 | Rendering | Annotations visible in gutter |
| 6 | Coloring | Authors color-coded |
| 7 | Events | Handles file switch/close, config change |

## 5. Validation Plan

- **Manual Testing**:
    - Open a git-tracked file.
    - Run "Git Blame: Show File Blame". Verify annotations appear.
    - Verify content matches `git blame` output.
    - Toggle settings (author format, date format) and verify updates.
    - Switch to another file, verify behavior.
    - Close file, verify cleanup.
    - Run "Git Blame: Hide File Blame".
- **Unit Tests**:
    - Test formatting logic (e.g., `formatAuthor("John Doe", "initials")` -> "JD").
    - Test color assignment logic.

## 6. Completion Criteria

- [ ] All tasks completed.
- [ ] Feature works as described in the summary.
- [ ] No significant performance regression on large files (relies on caching).
- [ ] Code follows project conventions.

## 7. Risk & Mitigation

- **Risk**: Performance on large files.
    - **Mitigation**: Ensure `BlameProvider` caching is working. Use `setDecorations` efficiently (batching).
- **Risk**: Visual clutter / Theme conflicts.
    - **Mitigation**: Use standard VS Code theme colors where possible, or transparent backgrounds. Provide "Enabled" setting default to `false`.

## 8. Next Steps

1.  Review this breakdown.
2.  Proceed to Feature Planning to create the implementation sequence.
