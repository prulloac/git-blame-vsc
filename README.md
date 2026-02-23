# git-blame-vsc

A lightweight VS Code extension that displays git blame information as an inline overlay when you click on a line in the editor. The overlay shows who made the change, when, and what the commit message was.

## Features

- **Git Blame Overlay**: Click any line to see git blame info with customizable formatting
- **Rich Blame Hovers**: Hover over any line to see detailed commit information in a tooltip
- **Status Bar Blame**: Optional always-visible blame info in the status bar (disabled by default)
- **Copy Commit Hash**: Quickly copy the commit hash for the current line to clipboard
- **Configurable Output Pattern**: Design your own blame display format (e.g., `<hash> <author>(<date>): <message>`)
- **Automatic Git Integration**: Uses direct git commands to fetch real blame data
- **Theme-aware styling**: Colors automatically adapt to your VS Code theme (light or dark)
- **Fully customizable**: Configure colors, font style, opacity, spacing, output pattern, and message length
- **Real-time updates**: Settings changes apply immediately to active overlays
- **Performance optimized**: Blame information is cached for 30 seconds
- **Silent mode for non-git files**: No overlay shown for files not in a git repository (no noise)
- **Clear command**: Easily remove overlays with the "Clear Line Overlay" command

## What You'll See

When you click on a line in a git repository (with default settings):

```
console.log('hello'); 25418bf john(2024-02-20): Add git blame support
```

The default format is: `<hash> <author>(<date>): <message>`

But you can customize this completely! See [Configuration](#configuration) for details.

On non-git files, no overlay is shown (empty string by default).

## Requirements

- VS Code 1.109.0 or later
- Git must be installed and available in your system PATH (for files in git repositories)

## Configuration

### Overview

The extension is highly customizable. You can control:
- **Output format**: How the blame information is displayed
- **Message length**: How much of the commit message to show
- **Visual appearance**: Colors, font style, opacity, and spacing

### Settings

#### Rich Blame Hovers

* `gitBlameOverlay.hoverEnabled`: Enable/disable hover tooltips with git blame information.
  - Type: `boolean`
  - Default: `true` (enabled)
  - When enabled, hovering over any line shows a rich tooltip with:
    - Commit hash (short 7-character version)
    - Full author name and email address
    - Commit date
    - Complete commit message (no truncation)
  - Hovers use markdown formatting for better readability
  - Automatically dismissed when you move your cursor away

* `gitBlameOverlay.hoverDelay`: Delay before showing hover tooltip.
  - Type: `number` (milliseconds)
  - Default: `2000` (2 seconds)
  - Range: `0` to `5000` (0 to 5 seconds)
  - Controls how long you need to hover before the tooltip appears
  - Set to `0` for instant display
  - Decrease for faster response (e.g., `500` = 0.5 seconds)
  - Default of 2 seconds ensures hovers only appear when intentionally pausing on a line

#### Status Bar Blame

* `gitBlameOverlay.statusBarEnabled`: Enable/disable status bar blame display.
  - Type: `boolean`
  - Default: `false` (disabled)
  - When enabled, shows git blame information in the VS Code status bar for the currently selected line
  - Updates automatically as you navigate through code
  - Uses the same `outputPattern` and `maxMessageLength` settings as the overlay

#### Output Pattern & Message Length

* `gitBlameOverlay.outputPattern`: Pattern for the blame output string. Use placeholders for author information:
  - `<hash>` - Commit hash (7-character short hash)
  - `<author>` - Full author name (e.g., "John Doe")
  - `<authorShort>` - First word of author name (e.g., "John")
  - `<authorEmail>` - Author email address (e.g., "john@example.com")
  - `<date>` - Commit date (YYYY-MM-DD format)
  - `<message>` - Commit message (truncated based on maxMessageLength)
  - Default: `[<hash>] <author> (<date>): <message>`
  - Examples:
    - `[<hash>] <author> (<date>): <message>` → `[25418bf] John Doe (2024-02-20): Add feature`
    - `<authorShort>: <message>` → `John: Add feature`
    - `<author> <authorEmail>` → `John Doe john@example.com`
    - `[<hash>] <author> - <date>` → `[25418bf] John Doe - 2024-02-20`
    - `<message> by <authorShort>` → `Add feature by John`

* `gitBlameOverlay.maxMessageLength`: Maximum length of the commit message portion in characters.
  - Default: `24`
  - Note: If message is longer, it will be truncated with `...` appended

#### Visual Appearance

* `gitBlameOverlay.backgroundColor`: Background color of the overlay (hex color, e.g., `#FFD700`). Defaults to editor background if not set.
* `gitBlameOverlay.textColor`: Text color of the overlay (hex color, e.g., `#000000`). Defaults to editor foreground if not set.
* `gitBlameOverlay.borderColor`: Border color of the overlay (hex color, e.g., `#FFA500`). Defaults to editor accent if not set.
* `gitBlameOverlay.fontWeight`: Font weight for overlay text. Options: `normal`, `bold`, `lighter`, `900`. Default: `bold`.
* `gitBlameOverlay.fontStyle`: Font style for overlay text. Options: `normal`, `italic`. Default: `italic`.
* `gitBlameOverlay.opacity`: Text opacity between 0 and 1. Default: `0.6` (60% opaque, 40% transparent).
* `gitBlameOverlay.marginLeft`: Left margin spacing before overlay text. Default: `1rem`.

### Example Configurations

#### Configuration 1: Minimal and Subtle (Recommended)

```json
{
  "gitBlameOverlay.outputPattern": "<authorShort>: <message>",
  "gitBlameOverlay.maxMessageLength": 24,
  "gitBlameOverlay.opacity": 0.5,
  "gitBlameOverlay.fontStyle": "italic",
  "gitBlameOverlay.marginLeft": "2rem"
}
```

Result: `John: Add feature support`

#### Configuration 2: Detailed Format with Email

```json
{
  "gitBlameOverlay.outputPattern": "[<hash>] <author> (<authorEmail>) <date>: <message>",
  "gitBlameOverlay.maxMessageLength": 40,
  "gitBlameOverlay.backgroundColor": "#f0f0f0",
  "gitBlameOverlay.textColor": "#333333",
  "gitBlameOverlay.opacity": 0.7
}
```

Result: `[25418bf] John Doe (john@example.com) 2024-02-20: Add feature support`

#### Configuration 3: Short Name Format

```json
{
  "gitBlameOverlay.outputPattern": "<message> (<authorShort>, <date>)",
  "gitBlameOverlay.maxMessageLength": 50,
  "gitBlameOverlay.fontWeight": "normal",
  "gitBlameOverlay.fontStyle": "normal"
}
```

Result: `Add feature support (John, 2024-02-20)`

#### Configuration 4: Full Author Info with Hash

```json
{
  "gitBlameOverlay.outputPattern": "[<hash>] <author> | <date> | <message>",
  "gitBlameOverlay.maxMessageLength": 30,
  "gitBlameOverlay.backgroundColor": "#FFD700",
  "gitBlameOverlay.textColor": "#000000",
  "gitBlameOverlay.borderColor": "#FF8C00",
  "gitBlameOverlay.opacity": 1,
  "gitBlameOverlay.fontWeight": "bold"
}
```

Result: `[25418bf] John Doe | 2024-02-20 | Add feature support`

#### Configuration 5: Enable Status Bar Blame

```json
{
  "gitBlameOverlay.statusBarEnabled": true,
  "gitBlameOverlay.outputPattern": "<authorShort> | <message>",
  "gitBlameOverlay.maxMessageLength": 30
}
```

Result: Status bar shows `$(git-commit) John | Add feature support` and updates automatically as you navigate

#### Configuration 6: Faster Hover Delay

```json
{
  "gitBlameOverlay.hoverEnabled": true,
  "gitBlameOverlay.hoverDelay": 500
}
```

Result: Hover tooltip appears after 0.5 seconds instead of the default 2 seconds. Useful if you want faster access to blame information on hover.

## Commands

The extension provides the following commands (accessible via Command Palette: Cmd+Shift+P or Ctrl+Shift+P):

### Clear Line Overlay
- **Command**: `Clear Line Overlay`
- **What it does**: Removes the git blame overlay from the current line
- **When to use**: When you want to clear the inline blame decoration without changing lines

### Copy Commit Hash
- **Command**: `Git Blame: Copy Commit Hash`
- **Access**: 
  - Command Palette (Cmd+Shift+P or Ctrl+Shift+P)
  - Right-click context menu in the editor
- **What it does**: Copies the full commit hash (40-character SHA-1) for the current line to your clipboard
- **When to use**: When you need to reference a commit in git commands, GitHub URLs, or commit messages
- **Behavior**:
  - Shows a notification with a preview of the copied hash (first 7 characters)
  - Works with any file in a git repository
  - Handles edge cases gracefully (uncommitted changes, non-git files, etc.)
- **No default keybinding**: This command intentionally has no keyboard shortcut to avoid conflicts with other extensions. You can assign your own keybinding in VS Code's Keyboard Shortcuts settings if desired.

### How to Apply Configuration

#### Via settings.json

Edit VS Code's `settings.json` directly (File > Preferences > Settings, then search "settings.json" in the search box):

```json
{
  "gitBlameOverlay.outputPattern": "<hash> <author>(<date>): <message>",
  "gitBlameOverlay.maxMessageLength": 24,
  "gitBlameOverlay.backgroundColor": "#FFD700",
  "gitBlameOverlay.textColor": "#000000",
  "gitBlameOverlay.fontWeight": "bold",
  "gitBlameOverlay.fontStyle": "italic",
  "gitBlameOverlay.opacity": 0.6,
  "gitBlameOverlay.marginLeft": "1rem"
}
```

#### Via Settings UI

1. Open Settings (Cmd+, or Ctrl+,)
2. Search for "Git Blame Overlay"
3. Adjust any setting visually
4. Changes apply immediately to active overlays

#### Workspace-Specific Settings

To apply different settings for specific projects, add them to `.vscode/settings.json` in your workspace root:

```json
{
  "gitBlameOverlay.outputPattern": "<author>: <message>",
  "gitBlameOverlay.maxMessageLength": 20
}
```

## How It Works

### Inline Overlay (Click-to-Show)
1. When you click on a line, the extension checks if the file is in a git repository
2. If yes, it fetches blame information using the `git blame` command
3. The blame info is parsed to extract commit hash, author, date, and message
4. The formatted output is generated using your configured `outputPattern`
5. A decoration is displayed in the editor (cached for 30 seconds)
6. If the file is not in git, or blame is unavailable, no overlay is shown

### Status Bar (Optional)
1. When enabled via `statusBarEnabled: true`, the status bar automatically displays blame info
2. Updates in real-time as you navigate to different lines
3. Uses the same formatting and caching as the inline overlay
4. Disabled by default to keep the UI minimal

### Rich Hover Tooltips (On by Default)
1. When enabled via `hoverEnabled: true` (default), hovering over any line shows a detailed tooltip
2. Tooltip appears after a brief delay (default: 2 seconds, configurable via `hoverDelay`)
3. Displays complete commit information without truncation:
   - Commit hash (7-character short version)
   - Author name and email
   - Commit date
   - Full commit message
4. Uses markdown formatting for better readability with bold headers and line breaks
5. Automatically dismissed when you move your cursor away
6. Benefits from the same 30-second cache as other features

## Testing the Extension

### Option 1: Debug Mode (Recommended)

For interactive testing with hot reload:

```bash
npm run watch
```

Then in VS Code, press `F5` to launch the extension in debug mode. This opens a new VS Code window with your extension active.

**Features in debug mode:**
- Changes to source files auto-compile as you edit
- Press `Ctrl+R` (Cmd+R on macOS) in the extension window to reload
- View extension logs in the Debug Console
- Set breakpoints and step through code

### Option 2: Run Tests

For automated testing:

```bash
npm test
```

This runs the extension test suite.

### Testing the Features

Once the extension is running in a git repository:

#### Inline Overlay Testing
1. **Test git blame**: Open a file in a git repository and click any line - you should see blame info formatted with your configured pattern
2. **Test fallback**: Open a non-git file and click a line - no overlay should appear (empty string)
3. **Test theme adaptation**: The overlay should match your editor's colors automatically
4. **Test custom output pattern**: 
   - Open Settings (Cmd+, or Ctrl+,)
   - Search for "outputPattern"
   - Try different patterns like `<author>: <message>` or `[<hash>] <author>`
   - Click on lines and watch the format change in real-time
5. **Test message truncation**: 
   - Set `maxMessageLength` to 10
   - Click a line with a long commit message and verify it's truncated
   - Increase `maxMessageLength` to 50 and verify more text appears
6. **Test custom colors**: 
   - Change a color setting and watch the overlay update in real-time
7. **Test opacity**: Set opacity to 0.3 and watch the text become very subtle
8. **Test italic**: Toggle fontStyle between 'normal' and 'italic' to see the difference
9. **Test clear command**: 
   - Open Command Palette (Cmd+Shift+P or Ctrl+Shift+P)
   - Run "Clear Line Overlay" - the overlay should disappear

#### Status Bar Testing
1. **Enable status bar**: Set `gitBlameOverlay.statusBarEnabled` to `true` in settings
2. **Test automatic updates**: Navigate to different lines with arrow keys or clicks - status bar should update automatically
3. **Test with custom pattern**: The status bar uses the same `outputPattern` as the overlay
4. **Disable status bar**: Set `statusBarEnabled` to `false` - status bar should disappear immediately

#### Rich Hover Testing
1. **Test hover display**: 
   - Open a file in a git repository
   - Hover your mouse over any line (or position cursor and wait)
   - A tooltip should appear after ~300ms with detailed commit information
   - Verify it shows: commit hash, author name, email, date, and full commit message
2. **Test markdown formatting**: The hover should have bold headers and proper line breaks
3. **Test full message**: Unlike the inline overlay, the hover shows the complete commit message without truncation
4. **Test auto-dismiss**: Move your cursor away - the hover should disappear automatically
5. **Test with multiple lines**: Hover over different lines in succession - each should show different commit info
6. **Test disable hover**: Set `gitBlameOverlay.hoverEnabled` to `false` - hovers should stop appearing
7. **Test non-git files**: Hover over a non-git file - no blame hover should appear

#### Copy Commit Hash Testing
1. **Test copy command**: 
   - Open a file in a git repository
   - Place cursor on any line
   - Open Command Palette (Cmd+Shift+P or Ctrl+Shift+P)
   - Run "Copy Commit Hash"
   - Verify you see a notification showing the hash (e.g., "Copied: 25418bf")
   - Paste somewhere (Cmd+V or Ctrl+V) to verify the full 40-character hash was copied
2. **Test with uncommitted changes**: Edit a file and test on an uncommitted line - should show appropriate message
3. **Test with non-git file**: Open a file outside git repository - should show error message gracefully
4. **Test no active editor**: Close all editors and run command - should show appropriate error

## Development

### Build
```bash
npm run compile
```

### Watch for changes
```bash
npm run watch
```

### Lint
```bash
npm run lint
```

## Known Issues

- Blame data is cached for 30 seconds to optimize performance. If a file changes externally, you may need to wait for the cache to expire or reload the window.
- Very large files may take a moment to compute blame information on first request
- Renamed or recently moved files may not show accurate blame information until the file is saved

## Release Notes

### 0.2.0

New features and enhancements:
- **Copy Commit Hash**: Copy git commit hash to clipboard from context menu or command palette
- **Status Bar Blame**: Optional always-visible blame info in the status bar (disabled by default)
- **Rich Blame Hovers**: Hover over any line to see detailed commit information in a tooltip
- **Configurable Hover Delay**: Control how long before hover tooltips appear (`hoverDelay` setting)
- Documentation updates to reflect current implementation status

### 0.0.2

Enhanced customization and formatting:
- Customizable output patterns with placeholders
- Theme-aware styling with automatic color adaptation
- Performance optimization with 30-second caching
- Real-time configuration updates

### 0.0.1

Initial release with git blame overlay feature:
- Git blame integration using VS Code git extension API
- Theme-aware color defaults
- Customizable appearance (colors, font, opacity, spacing)
- Click-to-display overlay functionality
- Clear overlay command
- Blame caching for performance
- Fallback to sample text for non-git files

---

Enjoy!

