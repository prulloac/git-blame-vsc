# git-blame-vsc

A lightweight VS Code extension that displays git blame information as an inline overlay when you click on a line in the editor. The overlay shows who made the change, when, and what the commit message was.

## Features

- **Git Blame Overlay**: Click any line to see one-line blame info: `[hash author date] commit message`
- **Automatic Git Integration**: Leverages VS Code's built-in git extension to fetch real blame data
- **Theme-aware styling**: Colors automatically adapt to your VS Code theme (light or dark)
- **Fully customizable**: Configure colors, font style, opacity, and spacing
- **Real-time updates**: Settings changes apply immediately to active overlays
- **Performance optimized**: Blame information is cached for 30 seconds
- **Fallback mode**: Shows sample text for non-git files or when blame is unavailable
- **Clear command**: Easily remove overlays with the "Clear Line Overlay" command

## What You'll See

When you click on a line in a git repository:

```
console.log('hello'); [25418bf John Doe 2024-02-20] Add git blame support
```

The overlay displays:
- **[hash]**: Short commit hash (7 characters)
- **author**: Commit author name
- **date**: Commit date (YYYY-MM-DD)
- **message**: First line of commit message (truncated to ~60 chars)

On non-git files, it shows: `[Sample: Line N]`

## Requirements

- VS Code 1.109.0 or later
- Git must be installed and available in your system PATH (for files in git repositories)

## Extension Settings

This extension contributes the following configurable settings:

* `gitBlameOverlay.backgroundColor`: Background color of the overlay (hex color, e.g., `#FFD700`). Defaults to editor background if not set.
* `gitBlameOverlay.textColor`: Text color of the overlay (hex color, e.g., `#000000`). Defaults to editor foreground if not set.
* `gitBlameOverlay.borderColor`: Border color of the overlay (hex color, e.g., `#FFA500`). Defaults to editor accent if not set.
* `gitBlameOverlay.fontWeight`: Font weight for overlay text. Options: `normal`, `bold`, `lighter`, `900`. Default: `bold`.
* `gitBlameOverlay.fontStyle`: Font style for overlay text. Options: `normal`, `italic`. Default: `italic`.
* `gitBlameOverlay.opacity`: Text opacity between 0 and 1. Default: `0.6` (60% opaque, 40% transparent).
* `gitBlameOverlay.marginLeft`: Left margin spacing before overlay text. Default: `1rem`.

### Example Configuration

Add this to your VS Code `settings.json` to customize the overlay appearance:

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

Or use VS Code's Settings UI (Settings > Git Blame Overlay) to configure these options visually.

## How It Works

1. When you click on a line, the extension checks if the file is in a git repository
2. If yes, it fetches blame information using VS Code's git extension API
3. The blame info is parsed to extract commit hash, author, date, and message
4. A formatted one-liner is displayed in the overlay (cached for 30 seconds)
5. If the file is not in git, or blame is unavailable, it shows a sample text instead

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

1. **Test git blame**: Open a file in a git repository and click any line - you should see blame info with author, date, and commit message
2. **Test fallback**: Open a non-git file and click a line - you should see `[Sample: Line N]`
3. **Test theme adaptation**: The overlay should match your editor's colors automatically
4. **Test custom colors**: 
   - Open Settings (Cmd+, or Ctrl+,)
   - Search for "Git Blame Overlay"
   - Change a color setting and watch the overlay update in real-time
5. **Test opacity**: Set opacity to 0.3 and watch the text become very subtle
6. **Test italic**: Toggle fontStyle between 'normal' and 'italic' to see the difference
7. **Test clear command**: 
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

