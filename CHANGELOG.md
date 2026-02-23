# Change Log

All notable changes to the "git-blame-vsc" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.2.1] - 2026-02-23

### Fixed
- Command naming consistency - All commands now properly include "Git Blame: " prefix for better discoverability in Command Palette
  - `Hello World` → `Git Blame: Hello World`
  - `Clear Line Overlay` → `Git Blame: Clear Line Overlay`
  - `Copy Commit Hash (Git Blame)` → `Git Blame: Copy Commit Hash`

## [0.2.0] - 2026-02-23

### Added
- Copy Commit Hash feature - Copy git commit hash to clipboard from context menu or command palette
- Status Bar Blame - Display git blame information in VS Code status bar for currently selected line
- Rich Blame Hovers - Show detailed commit information in hover tooltips with configurable delay
- Configurable hover delay setting (`gitBlameOverlay.hoverDelay`)

### Changed
- Updated all feature documentation to reflect current implementation status
- Improved documentation accuracy for implemented vs planned features

### Fixed
- Documentation status mismatches corrected (Copy Commit Hash, Status Bar Blame, Rich Blame Hovers now correctly marked as implemented)

## [0.0.2] - Previous Release

### Added
- Git Blame Overlay - Core click-to-show blame functionality
- Customizable Formatting - Pattern-based output customization
- Theme-Aware Styling - Automatic theme color adaptation
- Overlay Management - Lifecycle and display control
- Performance Optimization - 30-second caching system

## [0.0.1] - Initial Release

- Initial release