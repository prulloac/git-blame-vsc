# Execution Sequence: File Blame Annotations (Gutter Display)

## Overview

**Total Tasks**: 7
**Critical Path Length**: 5 tasks (1 -> 3 -> 4 -> 5 -> 6/7)
**Parallel Opportunities**: Commands (2) can be done in parallel with Blame Logic (3-7) after Scaffolding (1).

## Dependency Graph

```
Task 1 (Scaffolding)
  ├──► Task 2 (Commands)
  │
  └──► Task 3 (Blame Data)
         └──► Task 4 (Formatting)
                └──► Task 5 (Rendering)
                       ├──► Task 6 (Coloring)
                       └──► Task 7 (Events)
```

## Sequenced Task List

### Task 1: Scaffolding and Configuration
**Component**: Extension Registration / Configuration
**Depends On**: None
**Description**: Define the configuration schema in `package.json` and create the `GutterAnnotationManager` class structure.
**Acceptance Criteria**:
- [ ] `package.json` contains `gitBlameOverlay.gutterAnnotations` settings.
- [ ] `src/gutterAnnotationManager.ts` exists with basic class structure.

### Task 2: Command Registration
**Component**: Extension Entry Point
**Depends On**: Task 1
**Description**: Register `showFileBlame`, `hideFileBlame`, `toggleFileBlame` commands and connect to manager.
**Acceptance Criteria**:
- [ ] Commands appear in Command Palette.
- [ ] Commands trigger manager methods.

### Task 3: Blame Data Integration
**Component**: GutterAnnotationManager
**Depends On**: Task 1
**Description**: Implement logic to retrieve blame data using `BlameProvider`.
**Acceptance Criteria**:
- [ ] calling `show` retrieves blame data for active document.
- [ ] Data retrieved from cache if available.

### Task 4: Annotation Formatting Logic
**Component**: GutterAnnotationManager
**Depends On**: Task 3
**Description**: Format blame data (author, date) based on configuration.
**Acceptance Criteria**:
- [ ] Author names formatted (full/short/initials).
- [ ] Dates formatted.

### Task 5: Decoration Rendering (Core)
**Component**: GutterAnnotationManager
**Depends On**: Task 4
**Description**: Create and apply `vscode.TextEditorDecorationType`.
**Acceptance Criteria**:
- [ ] Annotations appear in gutter.
- [ ] "Hide" command clears decorations.

### Task 6: Author Color Coding
**Component**: GutterAnnotationManager
**Depends On**: Task 5
**Description**: Assign distinct colors to different authors.
**Acceptance Criteria**:
- [ ] Different authors have distinguishable colors.
- [ ] Colors consistent within session.

### Task 7: Event Handling
**Component**: GutterAnnotationManager
**Depends On**: Task 5
**Description**: Handle file switch/close and config changes.
**Acceptance Criteria**:
- [ ] Annotations update/clear on file switch.
- [ ] Annotations removed on close.
- [ ] Config changes update view.

## Batch Groupings

### Batch 1: Foundation
- Task 1: Scaffolding and Configuration
- Task 2: Command Registration

### Batch 2: Core Logic
- Task 3: Blame Data Integration
- Task 4: Annotation Formatting Logic

### Batch 3: Rendering & UX
- Task 5: Decoration Rendering (Core)
- Task 6: Author Color Coding
- Task 7: Event Handling

## Critical Path
Task 1 -> Task 3 -> Task 4 -> Task 5 -> Task 7

## Next Steps
Start with Batch 1.
