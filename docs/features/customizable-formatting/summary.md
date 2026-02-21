# Customizable Formatting Feature

## Overview

The Customizable Formatting feature allows users to design their own blame display format using a flexible pattern-based system. Users can choose which information to display, in what order, and with custom separators.

## Status

- **Status**: ✅ Current (v0.0.2)
- **Version**: 0.0.2
- **Since**: 0.0.1

## Feature Type

**Category**: Customization  
**Type**: Extended functionality that allows users to personalize the core feature

This feature enables users to customize the appearance and content of blame overlays, adapting the extension to different team standards, workflows, and personal preferences without requiring code changes.

## Business Value

Different development teams and workflows have different information needs. By allowing users to customize the format, the extension adapts to various development practices without requiring separate configuration tools or workarounds.

## What It Does

The feature provides a template system where users define a pattern string with placeholders that get replaced with actual blame information. This allows maximum flexibility with minimal configuration complexity.

## Configuration Options

### Output Pattern (`gitBlameOverlay.outputPattern`)

**Type**: String  
**Default**: `[<hash>] <author> (<date>): <message>`

The output pattern supports the following placeholders:

| Placeholder | Replaces With | Example |
|-------------|---------------|---------|
| `<hash>` | 7-character commit hash | `25418bf` |
| `<author>` | Full author name | `John Doe` |
| `<authorShort>` | First word of author name | `John` |
| `<authorEmail>` | Author email address | `john@example.com` |
| `<date>` | Commit date (YYYY-MM-DD) | `2024-02-20` |
| `<message>` | Commit message subject | `Add feature support` |

### Message Length (`gitBlameOverlay.maxMessageLength`)

**Type**: Number  
**Default**: `24` (characters)  
**Range**: 1 - unlimited

Controls how many characters of the commit message are displayed. If the message is longer, it's truncated with `...` appended.

## Configuration Examples

### Example 1: Minimal and Subtle (Recommended for Clean Code)

```json
{
  "gitBlameOverlay.outputPattern": "<authorShort>: <message>",
  "gitBlameOverlay.maxMessageLength": 24
}
```

**Output**: `John: Add feature support`

**Use Case**: Minimalist developers who want just the author and message

---

### Example 2: Detailed Format with Email

```json
{
  "gitBlameOverlay.outputPattern": "[<hash>] <author> (<authorEmail>) <date>: <message>",
  "gitBlameOverlay.maxMessageLength": 40
}
```

**Output**: `[25418bf] John Doe (john@example.com) 2024-02-20: Add feature support`

**Use Case**: Teams that need comprehensive attribution and tracking

---

### Example 3: Short Name Format

```json
{
  "gitBlameOverlay.outputPattern": "<message> (<authorShort>, <date>)",
  "gitBlameOverlay.maxMessageLength": 50
}
```

**Output**: `Add feature support (John, 2024-02-20)`

**Use Case**: Teams focused on commit messages rather than author details

---

### Example 4: Full Author Info with Hash

```json
{
  "gitBlameOverlay.outputPattern": "[<hash>] <author> | <date> | <message>",
  "gitBlameOverlay.maxMessageLength": 30
}
```

**Output**: `[25418bf] John Doe | 2024-02-20 | Add feature support`

**Use Case**: Organizations requiring detailed audit trails

---

### Example 5: Hash and Author Only

```json
{
  "gitBlameOverlay.outputPattern": "<hash> <authorShort>",
  "gitBlameOverlay.maxMessageLength": 1
}
```

**Output**: `25418bf John`

**Use Case**: Extreme minimalism for small displays or tiled layouts

---

## How to Apply Configuration

### Via VS Code Settings UI

1. Open Settings (Cmd+, or Ctrl+,)
2. Search for "Git Blame Overlay"
3. Modify "Output Pattern" and "Max Message Length"
4. Changes apply immediately to active overlays

### Via settings.json

Edit VS Code's `settings.json` directly:

```json
{
  "gitBlameOverlay.outputPattern": "<hash> <author>(<date>): <message>",
  "gitBlameOverlay.maxMessageLength": 24
}
```

### Workspace-Specific Settings

For project-specific configurations, add to `.vscode/settings.json`:

```json
{
  "gitBlameOverlay.outputPattern": "<authorShort>: <message>",
  "gitBlameOverlay.maxMessageLength": 20
}
```

## Technical Implementation

### Related Source Code
- **Formatting Logic**: [src/extension.ts#L54](../../src/extension.ts#L54-L75) - `formatBlameText()` function
- **Configuration Reading**: [src/extension.ts#L30](../../src/extension.ts#L30-L36) - `getBlameFormatConfig()` function

### Key Implementation Details

The formatting system:
1. Reads the pattern from VS Code configuration
2. Replaces all placeholder occurrences with actual values
3. Truncates the commit message based on `maxMessageLength`
4. Returns the formatted string to the overlay manager

```typescript
// Pattern: "[<hash>] <author> (<date>): <message>"
// Variables: { hash: "25418bf", author: "John", date: "2024-02-20", message: "Add feature" }
// Result: "[25418bf] John (2024-02-20): Add feature"
```

## Real-Time Updates

Configuration changes apply immediately:
1. User updates a setting in VS Code
2. Extension receives configuration change notification
3. If an overlay is currently visible, it updates in-place
4. No editor reload or extension restart required

## Constraints and Edge Cases

### Placeholder Handling
- Unknown placeholders are left as-is (e.g., `<unknown>` stays as `<unknown>`)
- Case-sensitive: `<hash>` works, `<Hash>` does not
- Placeholders can appear multiple times in the pattern

### Message Truncation
- Truncation happens after all other replacements
- Ellipsis (`...`) is always added if truncation occurs
- Minimum length of 1 character is enforced

### Non-Git Files
- No actual blame information exists
- Empty pattern results in empty overlay
- Useful for disabling the overlay: set pattern to empty string `""`

## Future Enhancements (Out of Scope - v0.0.2)

- [ ] Custom date format specifiers
- [ ] Support for relative dates (e.g., "2 days ago")
- [ ] Branch information in pattern
- [ ] Multiple blame formats (toggle between saved profiles)
- [ ] User-defined variables/aliases
- [ ] Conditional formatting (if/else logic)

## Related Features

- [Git Blame Overlay](../git-blame-overlay/README.md) - Provides the data being formatted
- [Theme-Aware Styling](../theme-aware-styling/README.md) - Visual presentation of formatted text
- [Overlay Management](../overlay-management/README.md) - Display of formatted output
