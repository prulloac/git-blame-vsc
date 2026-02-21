# Git Blame VSC - Feature Documentation Index

## Overview

This directory contains comprehensive documentation for all business features exposed to end users of the git-blame-vsc VS Code extension. Detailed feature documentation is organized in the `features/` subdirectory, with each feature having its own folder containing implementation plans, summaries, and references.

## Feature Type Classification

Features are categorized by their primary purpose:

| Type | Description | Examples |
|------|-------------|----------|
| **Core Functionality** | Essential features that define the extension's primary purpose | Git blame overlay display |
| **Customization** | Features that allow users to personalize behavior and appearance | Output pattern formatting |
| **User Experience** | Features that improve usability, visual integration, and interaction | Theme adaptation, overlay management |
| **Accessibility** | Features that support users with different abilities and needs | Color customization, opacity control |
| **Performance** | Technical features that optimize speed and resource usage | Caching, lazy loading, buffer management |
| **Extended Functionality** | Non-essential features that enhance the core capability | Additional configuration options |

## Feature List

The git-blame-vsc extension provides the following business features:

### Core Features

1. **[Git Blame Overlay](./features/git-blame-overlay/summary.md)** ✅
   - **Type**: Core Functionality
   - Click any line to see git blame information
   - Shows author, date, commit hash, and message
   - Intelligent fallback for non-git files
   - Real-time access to git history

2. **[Customizable Formatting](./features/customizable-formatting/summary.md)** ✅
   - **Type**: Customization
   - Design your own blame display format
   - Pattern-based template system with placeholders
   - Support for `<hash>`, `<author>`, `<date>`, `<message>` and more
   - Configurable message truncation

3. **[Theme-Aware Styling](./features/theme-aware-styling/summary.md)** ✅
   - **Type**: User Experience + Accessibility
   - Automatic adaptation to VS Code theme (light/dark)
   - Custom color overrides (background, text, border)
   - Typography control (font weight, style)
   - Opacity/transparency adjustment

4. **[Overlay Management](./features/overlay-management/summary.md)** ✅
   - **Type**: User Experience + Core Functionality
   - Single overlay at a time (clean UI)
   - Click-based activation
   - Clear overlay command
   - Real-time configuration updates

5. **[Performance Optimization](./features/performance-optimization/summary.md)** ✅
   - **Type**: Performance
   - 30-second blame cache
   - Large file support (up to 10MB buffer)
   - Lazy commit message loading
   - Minimal memory footprint

## Feature Status

| Feature | Type | Status | Version | Notes |
|---------|------|--------|---------|-------|
| Git Blame Overlay | Core Functionality | ✅ Current | v0.0.2 | Primary feature |
| Customizable Formatting | Customization | ✅ Current | v0.0.2 | Pattern-based customization |
| Theme-Aware Styling | UX + Accessibility | ✅ Current | v0.0.2 | Theme integration & accessibility |
| Overlay Management | UX + Core Functionality | ✅ Current | v0.0.2 | Overlay lifecycle control |
| Performance Optimization | Performance | ✅ Current | v0.0.2 | Caching and optimization |

## User Workflows

### Basic Usage
1. Open a file in a git repository
2. Click any line of code
3. Git blame overlay appears with formatted information
4. Click another line to update the overlay
5. Use "Clear Line Overlay" command to hide overlay

### Customization Workflow
1. Open VS Code Settings (Cmd+, or Ctrl+,)
2. Search for "Git Blame Overlay"
3. Modify desired settings:
   - Output pattern (text format)
   - Max message length
   - Colors (background, text, border)
   - Typography (font weight, style)
   - Opacity and spacing
4. Changes apply immediately to active overlays

### Team Configuration
1. Add `.vscode/settings.json` to repository root
2. Configure shared blame format and styling
3. All team members get consistent blame overlays
4. Individual users can override in personal settings

## Configuration Quick Reference

### Display Format
```json
{
  "gitBlameOverlay.outputPattern": "[<hash>] <author> (<date>): <message>",
  "gitBlameOverlay.maxMessageLength": 24
}
```

### Colors & Styling
```json
{
  "gitBlameOverlay.backgroundColor": "#FFD700",
  "gitBlameOverlay.textColor": "#000000",
  "gitBlameOverlay.borderColor": "#FFA500",
  "gitBlameOverlay.fontWeight": "bold",
  "gitBlameOverlay.fontStyle": "italic",
  "gitBlameOverlay.opacity": 0.6,
  "gitBlameOverlay.marginLeft": "1rem"
}
```

## Architecture Overview

```
Extension Entry Point (extension.ts)
├── BlameProvider (blameProvider.ts)
│   ├── Git command execution
│   ├── Blame output parsing
│   ├── Commit message fetching
│   └── Cache management (30s TTL)
│
├── OverlayManager (overlayManager.ts)
│   ├── Decoration creation
│   ├── Overlay positioning
│   ├── Configuration management
│   └── Styling/theme integration
│
└── Event Handlers
    ├── Click detection (onDidChangeTextEditorSelection)
    ├── Configuration changes (onDidChangeConfiguration)
    └── Extension lifecycle (activate/deactivate)
```

## Technical Documentation

For developers and contributors:

- **Blame Provider**: How git blame data is fetched and cached
- **Overlay Manager**: How decorations are created and styled
- **Extension Entry Point**: Event handling and coordination
- **Performance**: Caching strategy and optimization details
- **Styling**: Color resolution and theme integration

See individual feature READMEs for detailed technical sections and source code references.

## Requirements

- **VS Code**: 1.109.0 or later
- **Git**: Must be installed and accessible in system PATH
- **Repository**: Files must be in a git repository (blame only works for tracked files)

## Commands

| Command | ID | Description |
|---------|----|----|
| Clear Line Overlay | `git-blame-vsc.clearOverlay` | Removes current overlay |
| Hello World | `git-blame-vsc.helloWorld` | Test command (legacy) |

## Known Limitations

1. **Cache**: Blame data cached for 30 seconds; external file changes reflected after expiry
2. **Large files**: Very large files (>100MB) may take several seconds on first request
3. **Recently moved files**: Renamed/moved files may show inaccurate blame until saved
4. **Single overlay**: Only one overlay visible at a time

## Current Version

- **Extension**: v0.0.2
- **Minimum VS Code**: 1.109.0
- **Repository**: https://github.com/prulloac/git-blame-vsc
- **Publisher**: prulloac

## Future Roadmap (Out of Scope - v0.0.2)

- Keyboard shortcuts for showing blame
- Blame history navigation
- Hover-based overlay display
- Multiple overlays for selected ranges
- Custom blame display formats
- Branch information in overlay
- Blame age visualization
- Integration with source control sidebar

## Contributing

Documentation follows this structure:
- `docs/features/<feature-name>/summary.md` - Comprehensive feature documentation
- `docs/features/<feature-name>/breakdown.md` - Implementation tasks and acceptance criteria (generated by feature-breakdown skill)
- `docs/features/<feature-name>/implementation-sequence.md` - Execution timeline and task sequencing
- `docs/features/<feature-name>/implementation-progress.md` - Progress tracking during implementation

Each README covers: Overview, Status, Business Value, Configuration, Examples, Technical Implementation, Limitations, Future Enhancements

For submitting issues or feedback: https://github.com/prulloac/git-blame-vsc

## License

MIT - See LICENSE file in repository root
