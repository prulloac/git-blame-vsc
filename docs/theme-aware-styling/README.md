# Theme-Aware Styling Feature

## Overview

The Theme-Aware Styling feature automatically adapts the git blame overlay appearance to match the user's VS Code theme (light or dark mode). Users can also customize colors, opacity, and typography to match their personal preferences.

## Status

- **Status**: ✅ Current (v0.0.2)
- **Version**: 0.0.2
- **Since**: 0.0.1

## Feature Type

**Category**: User Experience + Accessibility  
**Type**: Extended functionality that enhances usability and visual integration

This feature ensures the overlay integrates naturally with the user's environment (theme, color scheme) and provides accessibility options for users with different visual needs, improving overall user experience.

## Business Value

By automatically adapting to the user's theme, the extension provides a seamless visual integration. Users don't have to manually adjust colors when switching themes, and custom colors allow accessibility and branding consistency across teams.

## What It Does

The feature applies VS Code theme colors to the overlay by default, but allows users to override with custom colors. It supports:

1. **Automatic theme detection**: Uses VS Code's current theme colors
2. **Custom color overrides**: Users can set hex colors to override theme defaults
3. **Opacity control**: Fine-tune text transparency (0 = invisible, 1 = fully opaque)
4. **Typography control**: Font weight and style customization

## Configuration Options

### Visual Appearance Settings

#### Background Color (`gitBlameOverlay.backgroundColor`)

**Type**: String (hex color or undefined)  
**Default**: Undefined (uses editor background)  
**Format**: `#RRGGBB` (e.g., `#FFD700`)

Sets the background color of the overlay text. If undefined, uses the VS Code editor background color.

#### Text Color (`gitBlameOverlay.textColor`)

**Type**: String (hex color or undefined)  
**Default**: Undefined (uses editor foreground)  
**Format**: `#RRGGBB` (e.g., `#000000`)

Sets the text color of the overlay. If undefined, uses the VS Code editor foreground color with applied opacity.

#### Border Color (`gitBlameOverlay.borderColor`)

**Type**: String (hex color or undefined)  
**Default**: Undefined (uses editor bracket match border)  
**Format**: `#RRGGBB` (e.g., `#FFA500`)

Sets the 1px border color around the overlay. If undefined, uses VS Code's bracket match border color.

#### Font Weight (`gitBlameOverlay.fontWeight`)

**Type**: String  
**Default**: `bold`  
**Options**: `normal`, `bold`, `lighter`, `900`

Controls the thickness of the text.

#### Font Style (`gitBlameOverlay.fontStyle`)

**Type**: String  
**Default**: `italic`  
**Options**: `normal`, `italic`

Controls whether text is italicized.

#### Opacity (`gitBlameOverlay.opacity`)

**Type**: Number  
**Default**: `0.6`  
**Range**: 0 to 1

Controls text transparency. Values:
- `0.3` = Very subtle, barely visible
- `0.6` = Default, readable but not intrusive
- `1.0` = Fully opaque, maximum visibility

#### Margin Left (`gitBlameOverlay.marginLeft`)

**Type**: String (CSS margin value)  
**Default**: `1rem`  
**Examples**: `0`, `0.5rem`, `10px`, `2em`

Spacing before the overlay text on the same line.

## Configuration Examples

### Example 1: Light Theme - Subtle Style

```json
{
  "gitBlameOverlay.backgroundColor": "#FFFACD",
  "gitBlameOverlay.textColor": "#333333",
  "gitBlameOverlay.borderColor": "#FFD700",
  "gitBlameOverlay.fontWeight": "normal",
  "gitBlameOverlay.fontStyle": "italic",
  "gitBlameOverlay.opacity": 0.5,
  "gitBlameOverlay.marginLeft": "1rem"
}
```

**Appearance**: Light yellow background, dark gray text, gold border, subtle italic style

**Use Case**: Light theme with minimal visual disruption

---

### Example 2: Dark Theme - High Contrast

```json
{
  "gitBlameOverlay.backgroundColor": "#1E1E1E",
  "gitBlameOverlay.textColor": "#00FF00",
  "gitBlameOverlay.borderColor": "#00AA00",
  "gitBlameOverlay.fontWeight": "bold",
  "gitBlameOverlay.fontStyle": "normal",
  "gitBlameOverlay.opacity": 0.8,
  "gitBlameOverlay.marginLeft": "1.5rem"
}
```

**Appearance**: Dark background, bright green text, dark green border, bold normal style

**Use Case**: Dark theme with maximum readability

---

### Example 3: Minimal Overlay (Almost Invisible)

```json
{
  "gitBlameOverlay.opacity": 0.3,
  "gitBlameOverlay.fontStyle": "italic",
  "gitBlameOverlay.fontWeight": "lighter",
  "gitBlameOverlay.marginLeft": "2rem"
}
```

**Appearance**: Uses editor theme colors, very subtle, moved far right

**Use Case**: Developers who want minimal visual noise

---

### Example 4: Accessibility - High Contrast with Dyslexia Font

```json
{
  "gitBlameOverlay.backgroundColor": "#FFFFFF",
  "gitBlameOverlay.textColor": "#000000",
  "gitBlameOverlay.borderColor": "#0000FF",
  "gitBlameOverlay.fontWeight": "bold",
  "gitBlameOverlay.fontStyle": "normal",
  "gitBlameOverlay.opacity": 1,
  "gitBlameOverlay.marginLeft": "1rem"
}
```

**Appearance**: White background, black text, blue border, fully opaque

**Use Case**: Teams with accessibility requirements

---

## Theme Integration

### Default Theme Colors

When color settings are **undefined** (not set by user), the extension uses VS Code theme colors:

| Setting | Theme Color | Used When |
|---------|------------|-----------|
| `backgroundColor` | `editor.background` | Not set by user |
| `textColor` | `editor.foreground` | Not set by user |
| `borderColor` | `editorBracketMatch.border` | Not set by user |

### Opacity Application

The opacity setting applies to the `textColor`:
- Automatically converted to alpha channel in hex color
- Works with both custom colors and theme colors
- Allows text blending with editor background

## How to Apply Configuration

### Via VS Code Settings UI

1. Open Settings (Cmd+, or Ctrl+,)
2. Search for "Git Blame Overlay"
3. Customize colors, opacity, and typography
4. Changes apply instantly to active overlays

### Via settings.json

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

### Workspace-Specific Settings

For team-wide consistency, add to `.vscode/settings.json`:

```json
{
  "gitBlameOverlay.backgroundColor": "#F5F5F5",
  "gitBlameOverlay.textColor": "#333333"
}
```

## Technical Implementation

### Related Source Code
- **Color Resolution**: [src/overlayManager.ts#L20](../../src/overlayManager.ts#L20-L30) - `resolveColor()` function
- **Decoration Creation**: [src/overlayManager.ts#L51](../../src/overlayManager.ts#L51-L63) - `createDecorationType()` method
- **Config Retrieval**: [src/extension.ts#L14](../../src/extension.ts#L14-L25) - `getOverlayConfig()` function

### Key Implementation Details

1. **Hex Color Format**: User-provided colors must be in `#RRGGBB` format
2. **Opacity Conversion**: Opacity (0-1) is converted to hex alpha channel (00-FF)
3. **Theme Color Fallback**: VS Code `ThemeColor` is used when no custom color is set
4. **Live Updates**: Configuration changes trigger recreation of decorations

### Color Resolution Logic

```
if (userProvidedColor && isHex) {
  use userColor + opacityAlpha
} else {
  use ThemeColor (automatically adapts to theme changes)
}
```

## Real-Time Customization

All styling changes apply immediately:
1. User adjusts a color/style setting
2. Overlay manager receives update notification
3. Decorations are recreated with new styles
4. Active overlay updates in-place if visible

No extension reload or VS Code restart required.

## Accessibility Considerations

The feature supports accessibility by:

1. **Custom colors**: Users can set high-contrast combinations for visual impairment
2. **Opacity control**: Allows reduction of visual intensity
3. **Theme integration**: Respects user's chosen theme preference
4. **Font control**: Supports different font weights and styles

## Current Limitations

1. **Fixed 1px border**: Border thickness cannot be customized
2. **No animation support**: Overlay styling is static
3. **Global styling only**: Cannot have per-file or per-language styling
4. **No gradient support**: Only solid colors are supported

## Future Enhancements (Out of Scope - v0.0.2)

- [ ] Per-language customization
- [ ] Different styles for different blame ages
- [ ] Animated overlays
- [ ] Custom border thickness
- [ ] Color picker UI in settings
- [ ] Saved color presets
- [ ] Gradient backgrounds

## Related Features

- [Git Blame Overlay](../git-blame-overlay/README.md) - Content being styled
- [Customizable Formatting](../customizable-formatting/README.md) - Text content of the overlay
- [Overlay Management](../overlay-management/README.md) - Overlay display logic
