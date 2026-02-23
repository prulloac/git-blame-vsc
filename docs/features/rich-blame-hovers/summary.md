# Rich Blame Hovers Feature

## Overview

Rich Blame Hovers provides detailed git blame information in a hover tooltip when hovering over any line in the editor, offering quick, non-intrusive access to comprehensive commit context without requiring clicks.

## Status

- **Status**: 🚧 Proposed (Not Yet Implemented)
- **Target Version**: 0.1.0
- **Effort Estimate**: 2-3 hours

## Feature Type

**Category**: Core Functionality + User Experience  
**Type**: Essential information access feature with enhanced workflow efficiency

This feature complements the existing click-based Git Blame Overlay by providing an alternative, hover-based interaction pattern. It qualifies as Core Functionality because it delivers the extension's primary value (git blame information access) while also being User Experience because it improves workflow efficiency through a familiar, low-friction hover interaction pattern similar to VS Code's built-in language hovers.

## Business Value

Users can access detailed git blame information instantly on hover without clicking, reducing friction in code review and debugging workflows. The hover pattern is familiar to developers from language servers and other VS Code features, making it intuitive and discoverable.

**Benefits**:
- **Faster information access**: No click required; hover provides instant context
- **More detailed information**: Shows full commit message and email without truncation (unlike inline overlay)
- **Familiar interaction pattern**: Leverages users' existing mental model of hovers in VS Code
- **Non-intrusive design**: Appears only when hovering; doesn't clutter the editor
- **Reduced context switching**: Get comprehensive blame details without opening git tools
- **Enhanced code review**: Quickly understand commit context during pull request reviews
- **Improved debugging workflow**: Discover when and why code changed while investigating issues

## What It Does

When a user hovers their cursor over a line of code in a git-tracked file:

1. The extension detects the hover event via VS Code's `HoverProvider` API
2. It queries the git repository for blame information for that specific line (reusing `BlameProvider.getBlameForLine()`)
3. A hover tooltip appears containing:
   - **Commit hash**: Full or shortened hash for easy reference
   - **Author information**: Full name and email address
   - **Commit date**: Human-readable timestamp
   - **Full commit message**: Complete message without truncation (unlike inline overlay)
4. The hover uses markdown formatting for improved readability with sections and emphasis

### User Experience

The interaction is seamless and requires no configuration:

1. User positions cursor over a line of code (or hovers with mouse)
2. After a brief delay (VS Code default hover delay), a rich tooltip appears
3. Hover remains visible while cursor is over the line or tooltip
4. Moving away dismisses the hover automatically
5. Works alongside existing click-based overlay (users can choose interaction style)

### Example Output

When hovering over a line, the tooltip might display:

```markdown
**Git Blame Information**

**Commit**: `25418bf` (or full hash: `25418bf3c7a9d1e2f4b5c6d7e8f9a0b1c2d3e4f5`)  
**Author**: John Doe <john.doe@example.com>  
**Date**: February 20, 2024 at 3:45 PM  

**Message**:  
Add git blame support with configurable output patterns

This feature allows users to click on any line and see comprehensive
blame information including author, date, and commit message.
```

The hover displays **complete information** without length constraints, unlike the inline overlay which truncates commit messages to `maxMessageLength`.

## Key Features

### Core Functionality
- **Hover-based activation**: No clicks required; information appears on hover
- **Rich markdown formatting**: Uses VS Code markdown rendering for better readability
- **Complete information display**: Shows full commit message, email, and all metadata
- **Reuses existing logic**: Leverages `BlameProvider.getBlameForLine()` for consistency
- **Theme-aware rendering**: VS Code automatically applies theme styling to hovers

### Extended Capabilities
- **Coexists with click overlay**: Users can choose between hover and click interactions
- **No configuration required**: Works out-of-box with sensible defaults
- **Smart caching**: Benefits from existing 30-second blame cache in `BlameProvider`
- **Graceful fallback**: Shows appropriate message for non-git files
- **Multiple format options** (future): Could support user-customizable hover templates

### Advantages Over Inline Overlay
- **Full commit message**: No truncation; see entire message regardless of length
- **Email addresses**: Shows complete author email for contact purposes
- **More readable formatting**: Markdown sections with bold headers and line breaks
- **Non-permanent**: Doesn't require "Clear Overlay" command; auto-dismisses on mouse-out
- **Familiar UX**: Matches VS Code's language hover pattern users already know

## Configuration

### Initial Implementation (Proposed)

The initial implementation requires **no configuration** and works with default settings. It automatically displays comprehensive blame information using a fixed markdown template.

### Future Configuration Options (Out of Scope for v0.1.0)

Potential future settings include:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `gitBlameOverlay.enableHoverProvider` | boolean | `true` | Enable/disable hover-based blame display |
| `gitBlameOverlay.hoverTemplate` | string | (markdown) | Custom markdown template for hover content |
| `gitBlameOverlay.showFullHash` | boolean | `false` | Show full commit hash instead of 7-char short hash |
| `gitBlameOverlay.hoverDelay` | number | (VS Code default) | Milliseconds before hover appears |

### Configuration Example (Future)

```json
{
  "gitBlameOverlay.enableHoverProvider": true,
  "gitBlameOverlay.showFullHash": false,
  "gitBlameOverlay.hoverTemplate": "**{author}** ({date})\\n\\n{message}"
}
```

**Result**: Simplified hover showing only author, date, and message  
**Use case**: Users who prefer minimal information in hovers

## Technical Implementation

### Related Source Code

- **Hover Provider (To Be Created)**: `src/blameHoverProvider.ts` (new file, ~80-100 lines)
- **Existing Blame Provider**: [src/blameProvider.ts](../../../src/blameProvider.ts) (reuse existing logic)
- **Extension Entry Point**: [src/extension.ts](../../../src/extension.ts#L79-L172) (register provider)

### Architecture Overview

The feature follows VS Code's standard `HoverProvider` pattern:

```
User Hovers Over Line
        ↓
VS Code Calls HoverProvider.provideHover()
        ↓
BlameHoverProvider.provideHover(document, position)
        ↓
Reuse: BlameProvider.getBlameForLine(filePath, lineNumber)
        ↓
Format Data as Markdown
        ↓
Return vscode.Hover with MarkdownString
        ↓
VS Code Displays Hover Tooltip
```

### Key Implementation Details

**BlameHoverProvider Class** (new file: `src/blameHoverProvider.ts`):
```typescript
import * as vscode from 'vscode';
import { BlameProvider } from './blameProvider';

export class BlameHoverProvider implements vscode.HoverProvider {
    constructor(private blameProvider: BlameProvider) {}
    
    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | null> {
        // 1. Check if file is in git repo
        if (document.uri.scheme !== 'file') {
            return null;
        }
        
        // 2. Get blame info for line (reuses existing provider)
        const blameInfo = await this.blameProvider.getBlameForLine(
            document.fileName,
            position.line
        );
        
        if (!blameInfo) {
            return null;
        }
        
        // 3. Format as markdown
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`**Git Blame Information**\n\n`);
        markdown.appendMarkdown(`**Commit**: \`${blameInfo.hash}\`\n`);
        markdown.appendMarkdown(`**Author**: ${blameInfo.author} <${blameInfo.authorEmail}>\n`);
        markdown.appendMarkdown(`**Date**: ${blameInfo.date}\n\n`);
        markdown.appendMarkdown(`**Message**:\n${blameInfo.message}\n`);
        
        // 4. Return hover with range
        return new vscode.Hover(markdown, new vscode.Range(position.line, 0, position.line, Number.MAX_VALUE));
    }
}
```

**Registration in Extension** (modify `src/extension.ts`):
```typescript
import { BlameHoverProvider } from './blameHoverProvider';

export async function activate(context: vscode.ExtensionContext) {
    // ... existing code ...
    
    // Register hover provider
    if (blameProvider) {
        const hoverProvider = new BlameHoverProvider(blameProvider);
        const hoverDisposable = vscode.languages.registerHoverProvider(
            { scheme: 'file' },  // Only for file:// URIs
            hoverProvider
        );
        context.subscriptions.push(hoverDisposable);
    }
    
    // ... existing code ...
}
```

### Design Decisions

1. **Reuse BlameProvider**: Avoids code duplication; benefits from existing caching and git integration
2. **Markdown formatting**: Leverages VS Code's built-in markdown renderer for consistent, theme-aware styling
3. **No truncation**: Unlike inline overlay, show complete commit message for comprehensive context
4. **Entire line range**: Hover applies to full line (not just code portion) for easier activation
5. **Coexistence with click overlay**: Both features remain available; users choose interaction style

### Performance Considerations

- **Caching benefit**: Leverages existing 30-second cache in `BlameProvider` (no additional git calls if recently queried)
- **Async operation**: Uses `async/await` to avoid blocking editor UI during git operations
- **Cancellation token**: Respects VS Code's cancellation token to abort if user moves cursor away
- **Minimal overhead**: Only creates markdown string; no heavy DOM manipulation

## User Interactions

### Primary Workflow

1. User opens a file in a git repository
2. User hovers cursor over a line of code (or positions cursor and waits)
3. After VS Code's default hover delay (~300ms), tooltip appears with blame information
4. User reads commit details from the hover
5. Hover dismisses automatically when user moves cursor away

### Alternative Workflows

- **Use with click overlay**: User can still click lines to show inline overlay if preferred
- **Keyboard navigation**: Position cursor with arrow keys; hover appears after delay
- **Quick scan**: Hover over multiple lines in succession to review blame history

### Commands

This feature requires **no new commands**. It uses VS Code's built-in hover mechanism, which is automatically triggered by cursor position and hover events.

### Interaction Comparison

| Interaction | Trigger | Display Location | Message Length | Dismissal |
|-------------|---------|------------------|----------------|-----------|
| **Inline Overlay** | Click | End of line | Truncated (24 chars default) | Manual command |
| **Rich Hover** | Hover | Tooltip above/below line | Full message | Automatic |

## Status and Roadmap

### Current Status

- ✅ **Proposal defined**: Feature specification complete
- ✅ **Effort estimated**: 2-3 hours implementation time
- ⏳ **Implementation**: Not yet started
- ⏳ **Testing**: Pending implementation
- ⏳ **Documentation**: Pending implementation

### Known Limitations (Anticipated)

1. **Cache dependency**: Like inline overlay, depends on 30-second blame cache; external changes may not reflect immediately
2. **Git requirement**: Requires git to be installed and accessible in system PATH
3. **Single hover**: VS Code shows only one hover at a time (combines with other providers like language servers)
4. **Hover priority**: If multiple hover providers are registered for the same position, VS Code displays all in one tooltip (potential clutter)
5. **No hover customization**: Initial version uses fixed markdown template (no user customization)
6. **Performance on large files**: Like inline overlay, very large files may have slight delay on first blame query

### Implementation Checklist

- [ ] Create `src/blameHoverProvider.ts` with `BlameHoverProvider` class
- [ ] Implement `provideHover()` method with markdown formatting
- [ ] Register hover provider in `src/extension.ts` activation
- [ ] Add hover provider to disposal in `deactivate()`
- [ ] Test with git-tracked files (various commit histories)
- [ ] Test with non-git files (graceful fallback)
- [ ] Test performance with large files
- [ ] Test coexistence with inline overlay (verify both work)
- [ ] Verify theme compatibility (light/dark/high-contrast)
- [ ] Add user documentation to README.md
- [ ] Update CHANGELOG.md for v0.1.0 release

### Future Enhancements (Out of Scope for v0.1.0)

#### Configuration & Customization
- [ ] Add `gitBlameOverlay.enableHoverProvider` setting to enable/disable
- [ ] Add `gitBlameOverlay.hoverTemplate` for custom markdown templates
- [ ] Add `gitBlameOverlay.showFullHash` to toggle full vs. short hash
- [ ] Support user-defined markdown sections (e.g., show/hide email)

#### Enhanced Features
- [ ] Show blame for entire file in hover (all authors/commits)
- [ ] Add "Copy Commit Hash" button in hover (markdown command links)
- [ ] Add "View Commit in GitHub" link if remote URL is GitHub
- [ ] Show commit diff snippet in hover (changed lines)
- [ ] Color-code commit age (recent commits highlighted)

#### Advanced Integration
- [ ] Hover over ranges (multi-line selection shows all unique commits)
- [ ] Integration with Git Graph or other git extensions
- [ ] Show commit tags/branches in hover if applicable
- [ ] Blame history navigation (previous commits for same line)

#### Performance & UX
- [ ] Preload blame data for visible lines (speculative caching)
- [ ] Progressive hover loading (show partial data while fetching message)
- [ ] Configurable hover delay via settings
- [ ] Smart hover positioning (avoid covering code)

## Related Features

- [Git Blame Overlay](../git-blame-overlay/summary.md) - Click-based inline overlay (complementary interaction)
- [Customizable Formatting](../customizable-formatting/summary.md) - Output pattern configuration (could extend to hovers in future)
- [Theme-Aware Styling](../theme-aware-styling/summary.md) - VS Code theme integration (hovers automatically themed)
- [Performance Optimization](../performance-optimization/summary.md) - 30-second caching system (shared by both features)

---

## Comparison: Rich Hovers vs. Inline Overlay

Both features serve the same goal (showing git blame information) but with different interaction patterns:

| Aspect | Rich Hover | Inline Overlay |
|--------|-----------|----------------|
| **Trigger** | Hover cursor over line | Click on line |
| **Effort** | Minimal (passive hover) | Minimal (single click) |
| **Message Length** | Full message displayed | Truncated (configurable) |
| **Email Display** | Always shown | Depends on output pattern |
| **Formatting** | Markdown with sections | Single-line pattern |
| **Visibility** | Tooltip (temporary) | Inline decoration (persistent) |
| **Dismissal** | Automatic (move cursor) | Manual (Clear Overlay command) |
| **Multiple Lines** | One hover at a time | One overlay at a time |
| **Discoverability** | Familiar hover pattern | Visible on click |
| **Screen Space** | Overlays content (tooltip) | Appends to line end |

### When to Use Each

**Use Rich Hover when**:
- You want to quickly scan blame information for multiple lines
- You need the full commit message without truncation
- You prefer passive, non-invasive interactions
- You're familiar with VS Code hover patterns (from language servers)

**Use Inline Overlay when**:
- You want blame information to persist on screen while working
- You prefer explicit, intentional interactions (click)
- You want blame data visible alongside code (not covering it)
- You're reviewing a specific line for an extended period

**Use Both**:
- Most users will benefit from both features working together
- Hover for quick scanning, click for persistent display
- Choose interaction style based on current task context
