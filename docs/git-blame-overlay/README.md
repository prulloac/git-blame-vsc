# Git Blame Overlay Feature

## Overview

The Git Blame Overlay is the core feature of the git-blame-vsc extension. It provides users with instant access to git blame information by clicking on any line in an editor within a git repository.

## Status

- **Status**: ✅ Current (v0.0.2)
- **Version**: 0.0.2
- **Since**: 0.0.1

## Feature Type

**Category**: Core Functionality  
**Type**: Primary feature that defines the extension's main purpose

This is the foundational feature that users install the extension for. All other features (formatting, styling, management, optimization) exist to enhance or support this core capability.

## Business Value

Users can immediately understand who made changes to a line and when without leaving their editor. This streamlines code review processes, debugging, and understanding code history during development.

## What It Does

When a user clicks on a line of code in a git-tracked file:

1. The extension detects the click event
2. It queries the git repository for blame information for that specific line
3. An inline overlay appears at the end of the line showing:
   - The commit hash (7-character short hash)
   - Author name and/or email
   - Commit date
   - Commit message (truncated configurable length)

### User Experience

```
console.log('hello');  [25418bf] John Doe (2024-02-20): Add git blame support
```

The overlay appears non-intrusively at the end of the clicked line, providing instant context about that line's origin.

## Key Features

### Core Functionality
- **Click-to-activate**: No keyboard shortcuts needed, simply click any line
- **Git integration**: Uses native `git blame` command for accuracy
- **Real-time access**: Instantly shows blame data from repository

### Data Provided
- **Commit hash**: Short 7-character hash for easy reference
- **Author information**: Full name and email extracted from git config
- **Commit date**: YYYY-MM-DD format for consistency
- **Commit message**: The subject line of the commit

### Non-Git Files
For files not in a git repository:
- Overlay still appears on click (empty string by default)
- No error messages or noise is generated
- Seamless user experience across tracked and untracked files

## Technical Implementation

### Related Source Code
- **Core Extension**: [src/extension.ts](../../src/extension.ts)
- **Blame Provider**: [src/blameProvider.ts](../../src/blameProvider.ts)
- **Overlay Manager**: [src/overlayManager.ts](../../src/overlayManager.ts)

### Key Components

#### Blame Provider (`blameProvider.ts`)
- Executes `git blame` command for files
- Parses blame output line-by-line
- Fetches full commit messages via `git log`
- Caches results for performance (30-second TTL)

#### Overlay Manager (`overlayManager.ts`)
- Creates VS Code decorations for inline display
- Positions overlays at line end
- Manages overlay lifecycle and clearing

#### Extension Entry Point (`extension.ts`)
- Registers click event listeners
- Coordinates between BlameProvider and OverlayManager
- Handles configuration and formatting

## User Interactions

### Primary Flow
1. User opens a file in a git repository
2. User clicks on a line of code
3. Extension queries git blame for that line
4. Overlay appears with formatted blame information
5. User can click another line to update the overlay, or use the clear command

### Clear Command
- Command: `git-blame-vsc.clearOverlay`
- Access: Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
- Result: Removes current overlay from the editor

## Configuration

This feature respects the following configurations (see customizable-formatting for details):

- `gitBlameOverlay.outputPattern`: Format of displayed information
- `gitBlameOverlay.maxMessageLength`: Truncation length for commit messages

## Current Limitations

1. **Cache limitations**: Blame data is cached for 30 seconds. External file changes may not reflect immediately.
2. **Large files**: Very large files may take a moment to compute blame on first request
3. **Recently moved files**: Renamed or moved files may show inaccurate blame until file is saved
4. **Git requirement**: Requires git to be installed and accessible in system PATH

## Future Enhancements (Out of Scope - v0.0.2)

- [ ] Keyboard shortcut to show blame without clicking
- [ ] Blame history navigation (show previous versions)
- [ ] Per-file cache lifetime configuration
- [ ] Blame for uncommitted changes
- [ ] Conflict marker resolution
- [ ] Support for git submodules

## Related Features

- [Customizable Formatting](../customizable-formatting/README.md) - Controls how blame data is displayed
- [Theme-Aware Styling](../theme-aware-styling/README.md) - Adapts overlay appearance to VS Code theme
- [Overlay Management](../overlay-management/README.md) - Controls overlay lifecycle and visibility
- [Performance Optimization](../performance-optimization/README.md) - Caching and performance tuning
