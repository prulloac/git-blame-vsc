# Performance Optimization Feature

## Overview

The Performance Optimization feature ensures the git blame overlay operates efficiently even in large repositories and large files. It implements intelligent caching, batch processing, and lazy evaluation to minimize performance impact on the editor.

## Status

- **Status**: ✅ Current (v0.0.2)
- **Version**: 0.0.2
- **Since**: 0.0.1

## Feature Type

**Category**: Performance  
**Type**: Technical feature that ensures efficient operation with large files and repositories

This feature implements caching, lazy loading, and buffer optimization to ensure the extension performs well in real-world development scenarios without slowing down the editor or creating perceived lag.

## Business Value

Users work with large codebases where performance is critical. Optimizations ensure that the extension doesn't slow down the editor or create perceived lag when clicking on lines.

## What It Does

The feature implements several optimization strategies:

1. **Blame data caching**: Stores computed blame output to avoid repeated git commands
2. **Cache expiry**: Automatic cache invalidation after 30 seconds
3. **Lazy loading**: Commits messages fetched only on-demand
4. **Large buffer support**: Handles multi-MB files without crashes
5. **Minimal state tracking**: Keeps in-memory footprint small

## Caching Strategy

### Blame Output Cache

**Purpose**: Store complete `git blame` output for files

**Key Details**:
- **Type**: In-memory Map<string, CacheEntry>
- **Key**: `${repoRoot}:${relativePath}` (unique per file)
- **Value**: `{ data: string, timestamp: number }`
- **TTL**: 30 seconds
- **Size**: Depends on file size (typically < 1MB per file)

**Benefits**:
- Eliminates redundant git command execution
- Improves UX for clicking same line multiple times
- Reduces system load on large files

### Cache Invalidation

The cache automatically expires after 30 seconds:

```typescript
if (cached && Date.now() - cached.timestamp < 30000) {
  return cached.data; // Use cache
} else {
  return getBlameOutput(); // Fetch fresh
}
```

**Rationale**:
- Balances performance (caching) with accuracy (expiry)
- Allows for external file changes to be reflected
- 30s is reasonable for typical development workflows

### Cache Management

**Clearing Cache**:
- Manual: `blameProvider.clearCache()` (called on extension deactivation)
- Automatic: Never (relies on expiry)

**Memory Limits**:
- No explicit limit (relies on system memory)
- Typically < 10MB for average development session
- Scales with number of open files

## Large File Handling

### Buffer Size Configuration

The `git blame` command uses an increased buffer size:

```typescript
execSync(command, { 
  encoding: 'utf-8', 
  maxBuffer: 10 * 1024 * 1024  // 10MB
});
```

**Purpose**:
- Prevents crashes on very large files
- Default Node.js buffer is 1MB
- 10MB accommodates most development scenarios

**Impact**:
- Large files process slower but safely
- No data loss or truncation
- User sees overlay after brief delay

## Lazy Commit Message Loading

### Two-Phase Blame Fetch

1. **Phase 1: Parse Blame Output** (Fast)
   - Run `git blame` once
   - Parse line synchronously
   - Extract hash, author, date
   - Time: O(1) per line

2. **Phase 2: Fetch Message** (On-Demand)
   - Run `git log -1 --format=%s [hash]`
   - Fetch subject line only (not full message)
   - Time: O(1) per commit

**Benefit**: Most interactive clicks don't need full commit messages, so lazy loading improves perceived performance.

### Async Pattern

Both phases are async to prevent blocking:

```typescript
const blameInfo = await blameProvider.getBlameForLine(file, line);
// Blame info returned quickly, message fetches separately if needed
```

## Command Optimization

### Git Command Selection

The extension uses optimal git commands:

| Operation | Command | Why |
|-----------|---------|-----|
| Get blame | `git blame` | Provides all needed info in one call |
| Get message | `git log -1 --format=%s` | Fetches only subject line, not full body |
| Relative path | Shell transformation | Avoids git plumbing commands |

### Execution Context

Commands execute from workspace root:

```typescript
cd "${repoRoot}" && git blame "${relativePath}"
```

**Benefit**: Ensures git commands work across different system configurations.

## Caching Examples

### Scenario 1: Repeated Clicks on Same Line

```
User clicks line 5
  ↓
Run: git blame myfile.ts
Result cached: {data: "...", timestamp: 1000}
  ↓
User clicks line 8
  ↓
Run: git blame myfile.ts
Cache hit! Return cached data (< 30s old)
No git command executed ✓
```

**Performance**: Second click is ~100x faster

### Scenario 2: Multiple Files in Session

```
User clicks line in file1.ts
  ↓
Blame cached: key="repo:/path/to/file1.ts"
  ↓
User clicks line in file2.ts
  ↓
Blame cached: key="repo:/path/to/file2.ts"
  ↓
Return to file1.ts (cache valid for 30s)
  ↓
Blame cache hit! No git command
```

**Memory**: Multiple files cached independently

### Scenario 3: Cache Expiry and Refresh

```
Time 0s: User clicks line
         Blame fetched and cached
         
Time 15s: User clicks same line
         Cache hit (15s < 30s)
         
Time 35s: User clicks same line
         Cache expired (35s > 30s)
         Git command executes again
         New cache entry created
```

**Accuracy**: Reflects changes after 30s

## Memory Management

### Minimal State Tracking

OverlayManager keeps minimal state:
- `currentLine: number | null`
- `activeEditor: vscode.TextEditor | null`
- `config: OverlayConfig`
- `decorationType: TextEditorDecorationType`

**Total**: ~1KB per active overlay

### Cleanup on Deactivation

When extension deactivates:
- `clearCache()` empties the blame cache
- `dispose()` releases decoration type
- Event listeners unregistered
- All references cleared

```typescript
context.subscriptions.push({
  dispose: () => {
    blameProvider.clearCache();  // Empty cache
    overlayManager.dispose();    // Clean up decorations
  }
});
```

**Result**: No memory leaks

## Performance Metrics

### Expected Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Click on line (cache miss) | 50-200ms | First click in file |
| Click on line (cache hit) | <5ms | Subsequent clicks within 30s |
| Click on large file (>50MB) | 200-500ms | Limited by buffer processing |
| Show overlay | <1ms | Decoration application |
| Update on config change | <10ms | Redraw active overlay |

### File Size Limits

| Size | Status | Notes |
|------|--------|-------|
| < 1MB | ✓ Excellent | Fast blame, instant display |
| 1-10MB | ✓ Good | Brief delay (< 1s) |
| 10-100MB | ⚠ Fair | Longer delay (1-5s), max buffer reached |
| > 100MB | ✗ Poor | May exceed buffer or timeout |

## Limitations

1. **Fixed cache TTL**: 30 seconds is not configurable
2. **No cache size limit**: Can consume significant memory in extreme cases
3. **Single thread**: Git commands block async operations
4. **No partial caching**: Entire file blame cached, not per-line
5. **No incremental updates**: Cache doesn't track file changes

## Future Enhancements (Out of Scope - v0.0.2)

- [ ] Configurable cache TTL
- [ ] LRU (Least Recently Used) cache eviction
- [ ] Per-line blame caching
- [ ] Incremental updates on file changes
- [ ] Background prefetching
- [ ] Cache size limits
- [ ] Performance metrics dashboard
- [ ] Blame diff mode (show only recent changes)
- [ ] Worker threads for large files

## Technical Details

### Related Source Code
- **Caching Logic**: [src/blameProvider.ts#L83](../../src/blameProvider.ts#L83-L128)
- **Message Fetching**: [src/blameProvider.ts#L133](../../src/blameProvider.ts#L133-L143)
- **Cache Clearing**: [src/blameProvider.ts#L227](../../src/blameProvider.ts#L227-L229)

### Cache Key Format

```typescript
// Format: "${repoRoot}:${relativePath}"
// Example: "/Users/dev/project:/src/components/Button.tsx"

// Ensures:
// ✓ Different repos don't conflict
// ✓ Same file in different repos cached separately
// ✓ Easy debugging and cache inspection
```

### External Process Execution

Git commands execute via Node.js `execSync`:

```typescript
execSync(command, { 
  encoding: 'utf-8', 
  maxBuffer: 10 * 1024 * 1024 
});
```

**Tradeoffs**:
- ✓ Simple, reliable
- ✓ Works across platforms
- ✗ Blocking (not ideal for large operations)
- ✗ No progress reporting

## Related Features

- [Git Blame Overlay](../git-blame-overlay/README.md) - Calls caching functions
- [Overlay Management](../overlay-management/README.md) - Manages UI rendering
