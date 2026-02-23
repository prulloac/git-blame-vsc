# Overlay Management Feature

## Overview

The Overlay Management feature controls the complete lifecycle of git blame overlays: how they're created, displayed, updated, and removed. It handles the visual presentation layer and user interactions for managing overlay visibility.

## Status

- **Status**: ✅ Current (v0.2.0)
- **Version**: 0.2.0
- **Since**: 0.0.1

## Feature Type

**Category**: User Experience + Core Functionality  
**Type**: Core supporting feature that enables controlled interaction with the overlay

This feature manages the user-facing lifecycle and interaction model for overlays. It's essential to the core functionality, providing intuitive controls for showing, hiding, and managing blame information display.

## Business Value

Overlay management ensures consistent, performant display of blame information. It provides users with intuitive controls to show, hide, and manage overlays without cluttering the editor with permanent decorations.

## What It Does

The feature manages:

1. **Overlay display**: Creates and positions overlays at line end
2. **Single overlay limit**: Only one overlay visible at a time
3. **Click-based activation**: Overlay shows when user clicks a line
4. **Clearing overlays**: Command to remove current overlay
5. **Configuration updates**: Real-time application of styling changes

## User Interactions

### Showing an Overlay

**Trigger**: User clicks on a line in the editor

**Action Flow**:
1. Click event detected on a line
2. Line number extracted from cursor position
3. Blame data retrieved for that line
4. Overlay displayed at end of line
5. Previous overlay automatically hidden

**Result**: Single overlay visible at end of clicked line

```
Example line of code        [hash] author (date): message
```

### Clearing an Overlay

**Trigger**: Command `git-blame-vsc.clearOverlay`

**Access**: Command Palette (Cmd+Shift+P or Ctrl+Shift+P)

**Action Flow**:
1. User opens Command Palette
2. Searches for "Clear Line Overlay"
3. Executes command
4. Current overlay removed

**Result**: No overlays visible in editor

### Updating an Overlay

**Trigger**: User clicks a different line

**Action Flow**:
1. Previous overlay automatically cleared
2. Blame data fetched for new line
3. New overlay displayed

**Result**: Overlay moves to newly clicked line with updated information

## Configuration Management

### Configuration Persistence

Configurations that affect overlay appearance:

- **Visual Styling**: [Theme-Aware Styling](../theme-aware-styling/README.md)
  - `backgroundColor`, `textColor`, `borderColor`
  - `fontWeight`, `fontStyle`, `opacity`, `marginLeft`

- **Content Formatting**: [Customizable Formatting](../customizable-formatting/README.md)
  - `outputPattern`, `maxMessageLength`

### Real-Time Updates

When user changes any overlay-related setting:

1. Configuration change event triggered
2. Extension notifies OverlayManager
3. Decoration type recreated with new settings
4. Active overlay updated if visible

No need for extension restart or editor reload.

## Technical Implementation

### Related Source Code
- **Overlay Manager**: [src/overlayManager.ts](../../src/overlayManager.ts)
- **Extension Event Handling**: [src/extension.ts#L107](../../src/extension.ts#L107-L143)
- **Configuration Listener**: [src/extension.ts#L146](../../src/extension.ts#L146-L150)

### Key Classes and Methods

#### OverlayManager Class

**Responsibilities**:
- Create and manage VS Code decorations
- Track active overlay position
- Update styling on configuration changes
- Clean up resources

**Key Methods**:

| Method | Purpose |
|--------|---------|
| `constructor(config)` | Initialize with configuration |
| `showOverlay(line, editor, text)` | Display overlay on specific line |
| `clearOverlay()` | Remove current overlay |
| `updateConfig(config)` | Apply new configuration |
| `dispose()` | Clean up resources |

### Overlay Positioning

Overlays are positioned at the **end of the line** using VS Code decoration `after` pseudo-element:

```
Line: "const x = 42"        [hash] author (date): message
      └─ Content ─┘└─────── Overlay ──────┘
```

**Technical Details**:
- Range positioned at end of line (after last character)
- Decoration applied using `setDecorations()`
- Single decoration type per active overlay
- Position tracks line content length

### Decoration Lifecycle

```
User Clicks Line
    ↓
Get Blame Data
    ↓
Create Decoration Options
    ↓
Apply to Editor
    ↓
Show Overlay
    ↓
User Clicks Another Line
    ↓
Clear Previous Decoration
    ↓
Create New Decoration
    ↓
Repeat...
```

## Single Overlay Design

The extension uses a **single-overlay-at-a-time** design:

**Benefits**:
- Clean, uncluttered editor UI
- User focuses on one line at a time
- Reduced performance overhead
- Predictable behavior

**Implementation**:
- Tracks current line and active editor
- Clears previous overlay before showing new one
- Prevents multiple overlays from accumulating

## Commands

### Clear Line Overlay

**Command ID**: `git-blame-vsc.clearOverlay`  
**Title**: "Clear Line Overlay"  
**Keyboard**: None (use Command Palette)

Removes the currently displayed overlay and resets the overlay manager state.

```typescript
// Usage from Command Palette
overlayManager.clearOverlay();
// Result: All decorations removed, currentLine = null
```

## Event Handling

### Editor Selection Changes

**Event**: `onDidChangeTextEditorSelection`

**Handled by**: [src/extension.ts#L107](../../src/extension.ts#L107)

Triggers when user:
- Clicks in editor
- Uses arrow keys to move cursor
- Selects text

For each change:
1. Extract line number from selection
2. Fetch blame data
3. Update overlay

### Configuration Changes

**Event**: `onDidChangeConfiguration`

**Handled by**: [src/extension.ts#L146](../../src/extension.ts#L146)

Triggers when user modifies any `gitBlameOverlay.*` setting.

For each change:
1. Read new configuration
2. Update OverlayManager config
3. Recreate decorations
4. Redraw active overlay if visible

## Performance Considerations

### Decoration Reuse

The same decoration type is reused across multiple overlays:
- Single type created per configuration
- Multiple decoration options applied to same type
- Reduces VS Code extension API overhead

### State Tracking

Minimal state tracking:
- Current line number
- Active editor reference
- Current configuration object
- Single decoration type

No persistent storage or external dependencies.

## Error Handling

### Non-File Schemes

Overlay not shown for schemes other than `file`:
- `git` (version control)
- `debug` (debugger views)
- `git+https` (remote repos)

Prevents errors and improves performance.

### Missing Blame Data

When blame data cannot be fetched:
- Fallback to empty overlay (configurable)
- No error messages shown to user
- Silent degradation

### Disabled Extension

If overlayManager is null:
- Events handled gracefully
- No crashes or unexpected behavior
- User simply sees no overlays

## Current Limitations

1. **Single overlay only**: Cannot show multiple overlays simultaneously
2. **Line-end positioning**: Cannot position overlay elsewhere
3. **No keyboard support**: Must click to show overlay (no keyboard command)
4. **No hover preview**: Overlay only shows on click
5. **No overlay history**: Cannot navigate through previous overlays

## Future Enhancements (Out of Scope - v0.0.2)

- [ ] Hover-based overlay display
- [ ] Keyboard shortcut to show blame
- [ ] Multiple overlays for selected range
- [ ] Overlay history navigation
- [ ] Custom positioning options (inline, above line, sidebar)
- [ ] Overlay persistence toggle
- [ ] Blame blame (show who changed the blame info)

## Related Features

- [Git Blame Overlay](../git-blame-overlay/README.md) - Provides the data
- [Theme-Aware Styling](../theme-aware-styling/README.md) - Controls appearance
- [Customizable Formatting](../customizable-formatting/README.md) - Controls content
- [Performance Optimization](../performance-optimization/README.md) - Optimizes display
