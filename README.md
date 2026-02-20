# git-blame-vsc

A lightweight VS Code extension that displays git blame information as an inline overlay when you click on a line in the editor. The overlay shows who made the change, when, and what the commit message was.

## Features

- **Git Blame Overlay**: Click any line to see git blame info with customizable formatting
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

#### Output Pattern & Message Length

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

1. When you click on a line, the extension checks if the file is in a git repository
2. If yes, it fetches blame information using the `git blame` command
3. The blame info is parsed to extract commit hash, author, date, and message
4. The formatted output is generated using your configured `outputPattern`
5. A decoration is displayed in the editor (cached for 30 seconds)
6. If the file is not in git, or blame is unavailable, it shows a sample text instead

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

### Testing the Overlay Feature

Once the extension is running in a git repository:

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

### 0.0.1

Initial release with git blame overlay feature
- Git blame integration using VS Code git extension API
- Theme-aware color defaults
- Customizable appearance (colors, font, opacity, spacing)
- Click-to-display overlay functionality
- Clear overlay command
- Blame caching for performance
- Fallback to sample text for non-git files

---

Enjoy!

