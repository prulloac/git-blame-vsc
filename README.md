# git-blame-vsc

A lightweight VS Code extension that displays an overlay on the current line when you click in the editor. The overlay automatically adapts to your editor's theme colors but can be customized to match your preferences.

## Features

- **Click-to-overlay**: Click any line in the editor to display an overlay showing the line number
- **Theme-aware styling**: Colors automatically adapt to your VS Code theme (light or dark)
- **Fully customizable**: Configure background color, text color, border color, font weight, and spacing
- **Real-time updates**: Settings changes apply immediately to active overlays
- **Clear command**: Easily remove overlays with the "Clear Line Overlay" command

## Extension Settings

This extension contributes the following configurable settings:

* `gitBlameOverlay.backgroundColor`: Background color of the overlay (hex color, e.g., `#FFD700`). Defaults to editor background color if not set.
* `gitBlameOverlay.textColor`: Text color of the overlay content (hex color, e.g., `#000000`). Defaults to editor foreground color if not set.
* `gitBlameOverlay.borderColor`: Border color of the overlay (hex color, e.g., `#FFA500`). Defaults to editor accent color if not set.
* `gitBlameOverlay.fontWeight`: Font weight for overlay text. Options: `normal`, `bold`, `lighter`, `900`. Default: `bold`.
* `gitBlameOverlay.marginLeft`: Left margin spacing before overlay text. Default: `1rem`.

### Example Configuration

Add this to your VS Code `settings.json` to customize the overlay appearance:

```json
{
  "gitBlameOverlay.backgroundColor": "#FFD700",
  "gitBlameOverlay.textColor": "#000000",
  "gitBlameOverlay.borderColor": "#FFA500",
  "gitBlameOverlay.fontWeight": "bold",
  "gitBlameOverlay.marginLeft": "1rem"
}
```

Or use VS Code's Settings UI (Settings > Git Blame Overlay) to configure these options visually.

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

Once the extension is running:

1. **Basic overlay test**: Click any line in an editor - you should see `[Sample: Line N]` appear at the end of the line
2. **Theme color test**: The overlay should automatically match your editor's colors. Try switching between light and dark themes to see the colors adapt
3. **Custom colors test**: 
   - Open Settings (Cmd+, or Ctrl+,)
   - Search for "Git Blame Overlay"
   - Change a color setting and watch the overlay update in real-time
4. **Clear command test**: 
   - Open Command Palette (Cmd+Shift+P or Ctrl+Shift+P)
   - Run "Clear Line Overlay" - the overlay should disappear
5. **Configuration reload test**: Change a setting while an overlay is visible - it should update immediately

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

- The extension currently displays a sample overlay. Future versions will integrate with git blame information.

## Release Notes

### 0.0.1

Initial release with configurable overlay feature
- Theme-aware color defaults
- Customizable appearance settings
- Click-to-display overlay functionality
- Clear overlay command

---

Enjoy!

