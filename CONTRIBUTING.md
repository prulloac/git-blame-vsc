# Contributing

Thank you for your interest in contributing!

## Coding Guidelines

This is a TypeScript-based VS Code extension. Please follow these guidelines:

### Language and TypeScript

- **TypeScript strict mode**: All code must compile with `strict: true` enabled in tsconfig.json
- **Type safety**: Avoid using `any` types; prefer explicit types or generics
- **Null safety**: Handle null/undefined cases explicitly (enabled via strict mode)
- **Modern JavaScript**: Target ES2022 (as configured in tsconfig.json)

### Code Formatting and Style

- **Linting**: Run `npm run lint` before committing. ESLint is configured with typescript-eslint
- **Semicolons**: Required (enforced by ESLint `semi` rule)
- **Equality**: Use strict equality (`===` and `!==`) instead of loose equality (enforced by `eqeqeq` rule)
- **Curly braces**: Always use curly braces for control statements (enforced by `curly` rule)
- **No throw literals**: Use proper Error objects when throwing exceptions

### Naming Conventions

- **Files**: Use camelCase for TypeScript files (e.g., `blameProvider.ts`, `overlayManager.ts`)
- **Classes**: PascalCase (e.g., `BlameProvider`, `OverlayManager`)
- **Functions and variables**: camelCase (e.g., `getBlameForLine`, `overlayManager`)
- **Imports**: camelCase or PascalCase (enforced by ESLint naming-convention rule)
- **Configuration keys**: camelCase with dot notation (e.g., `gitBlameOverlay.backgroundColor`)

### Architecture Patterns

- **VS Code Extension API**: Follow VS Code extension best practices
  - Use `vscode` module for all editor interactions
  - Register disposables in `context.subscriptions` to prevent memory leaks
  - Implement proper `activate()` and `deactivate()` lifecycle methods
- **Separation of concerns**: Each module should have a single, well-defined responsibility:
  - `extension.ts`: Extension lifecycle and command registration
  - `blameProvider.ts`: Git blame data retrieval
  - `overlayManager.ts`: Visual overlay rendering
  - `statusBarManager.ts`: Status bar integration
  - `blameHoverProvider.ts`: Hover tooltip provider
- **Configuration management**: Use `vscode.workspace.getConfiguration()` for settings
- **Error handling**: Always handle errors gracefully with try-catch and user-friendly messages

### File Organization

```
src/
├── extension.ts              # Main extension entry point
├── blameProvider.ts          # Git blame logic
├── overlayManager.ts         # Overlay decoration management
├── statusBarManager.ts       # Status bar integration
├── blameHoverProvider.ts     # Hover provider implementation
└── test/                     # Test files
    └── extension.test.ts     # Extension tests
```

### Performance Considerations

- **Caching**: Implement caching for expensive operations (e.g., git blame results are cached for 30 seconds)
- **Async operations**: Use async/await for I/O operations to avoid blocking the UI thread
- **Disposal**: Always dispose of resources (decorations, status bar items, event listeners) in `deactivate()`
- **Event throttling**: Be mindful of editor events that fire frequently (selection changes, document edits)

## Testing Guidelines

This project uses the VS Code Test framework with Mocha.

### Testing Framework

- **Framework**: Mocha test suite with VS Code Test Runner
- **Test runner**: `@vscode/test-cli` and `@vscode/test-electron`
- **Assertions**: Node.js built-in `assert` module

### Running Tests

```bash
# Run all tests
npm test

# Compile and run tests with linting
npm run pretest
```

The `npm test` command automatically:
1. Compiles TypeScript to JavaScript
2. Runs ESLint checks
3. Executes tests in a VS Code instance

### Test File Location

- **Test directory**: `src/test/`
- **Test file pattern**: `*.test.ts`
- **Compiled tests**: `out/test/*.test.js` (auto-generated)

### Writing Tests

1. **File naming**: Name test files with `.test.ts` suffix (e.g., `extension.test.ts`)
2. **Test structure**: Use Mocha's `suite()` and `test()` functions
3. **Assertions**: Use Node.js `assert` module

Example test structure:

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('My Feature Test Suite', () => {
    test('Should do something', () => {
        assert.strictEqual(actual, expected);
    });

    test('Should handle edge cases', async () => {
        const result = await someAsyncFunction();
        assert.ok(result);
    });
});
```

### Test Coverage

- **Current focus**: Extension activation and core functionality
- **Goal**: Test all public APIs and commands
- **Priority areas**:
  - Extension activation/deactivation
  - Command registration and execution
  - Configuration changes
  - Git blame parsing
  - Error handling for edge cases

### Types of Tests

1. **Unit tests**: Test individual modules in isolation (providers, managers)
2. **Integration tests**: Test VS Code extension integration (commands, decorations)
3. **Manual testing**: Follow the testing guide in README.md for UI/UX validation

### Before Submitting

- Ensure all tests pass: `npm test`
- Verify linting passes: `npm run lint`
- Test manually in debug mode: `npm run watch` + F5

## Issue Submission

When reporting a bug, please include:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Environment details (OS, versions, etc.)
- Any relevant logs or screenshots

## Feature Requests

For feature requests, please include:
- A clear description of the feature
- Use cases and why this feature would be valuable
- Any ideas for implementation (optional)

## Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Changes to build process, dependencies, or tooling
- `perf`: A code change that improves performance
- `ci`: Changes to CI configuration

### Rules

- Use lowercase for type and scope
- Keep the subject line under 72 characters
- Use imperative mood ("add" not "added" or "adds")
- Reference issues and pull requests where relevant
- Separate subject from body with a blank line

### Examples

```
feat(overlay): add configurable hover delay setting

Allows users to control how long before hover tooltips appear.
Default remains 2000ms for backwards compatibility.
```

```
fix(blame): resolve null pointer when file not in git

The blame provider was throwing a null pointer exception when
attempting to get blame info for files outside a git repository.

Fixes #42
```

```
docs(readme): update configuration examples

Added examples for new hover delay setting and clarified
status bar configuration options.
```

```
refactor(provider): extract git command execution to utility

This improves code organization and makes the blame provider
more testable and maintainable.
```

```
test(overlay): add unit tests for decoration rendering
```

```
chore(deps): update @types/vscode to 1.110.0

Required for compatibility with latest VS Code API features.
```

```
perf(cache): increase blame cache duration to 60 seconds

Reduces git command executions for frequently accessed files.
```

## Pull Requests

1. Fork the repository and create a branch from `main`
2. Make your changes following the coding guidelines
3. Add or update tests as appropriate
4. Ensure all tests pass: `npm test`
5. Ensure linting passes: `npm run lint`
6. Test your changes in VS Code debug mode (see Development Workflow)
7. Update documentation if needed (README.md, CHANGELOG.md)
8. Keep your commit history clean:
   - The number of commits should not exceed the number of files changed
   - Consider rebasing and squashing commits to consolidate related changes
   - Each commit should represent a meaningful, atomic change
9. Submit a pull request with a clear description of the changes
10. Respond to any feedback or review comments

## Development Workflow

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prulloac/git-blame-vsc.git
   cd git-blame-vsc
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript**:
   ```bash
   npm run compile
   ```

### Development Process

1. **Start watch mode** (auto-compile on file changes):
   ```bash
   npm run watch
   ```

2. **Launch Extension Development Host**:
   - Press `F5` in VS Code to open a new Extension Development Host window
   - Your extension will be active in this window
   - Set breakpoints in your TypeScript code for debugging

3. **Reload after changes**:
   - Make code changes (watch mode auto-compiles)
   - Press `Ctrl+R` (or `Cmd+R` on macOS) in the Extension Development Host to reload
   - Or use the "Developer: Reload Window" command

4. **View logs**:
   - Debug Console in VS Code shows extension logs
   - Use `console.log()`, `console.error()` for debugging
   - Check Output panel > "Extension Host" for additional logs

### Testing Your Changes

1. **Automated tests**:
   ```bash
   npm test
   ```

2. **Manual testing**:
   - Open a git repository in the Extension Development Host
   - Click on lines to test blame overlay
   - Try different configuration settings in Settings UI
   - Test all commands from Command Palette
   - See README.md "Testing the Extension" section for comprehensive test cases

3. **Linting**:
   ```bash
   npm run lint
   ```

### Building for Release

```bash
# Compile for production
npm run vscode:prepublish
```

This command runs `npm run compile` which compiles TypeScript with production settings.

### Common Development Tasks

| Task | Command |
|------|---------|
| Compile once | `npm run compile` |
| Compile and watch | `npm run watch` |
| Run tests | `npm test` |
| Lint code | `npm run lint` |
| Debug extension | Press `F5` in VS Code |
| Package extension | `vsce package` (requires @vscode/vsce) |

### Debugging Tips

- **Breakpoints**: Set breakpoints in `.ts` files (source maps are enabled)
- **Console output**: Use `console.log()` and check the Debug Console
- **Extension logs**: Check Output > "Extension Host" for runtime errors
- **Reload window**: Use `Ctrl+R` / `Cmd+R` in Extension Development Host to apply changes
- **Inspect variables**: Hover over variables while debugging to see their values
- **Call stack**: Use the Call Stack panel to trace execution flow

## Environment Requirements

- **Node.js**: Version 22.x or compatible
- **VS Code**: Version 1.109.0 or later
- **Git**: Required for testing git blame functionality
- **npm**: Comes with Node.js
- **Operating Systems**: Windows, macOS, or Linux

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows TypeScript strict mode requirements
- [ ] ESLint passes without warnings (`npm run lint`)
- [ ] All tests pass (`npm test`)
- [ ] Manual testing completed in Extension Development Host
- [ ] Documentation updated (README.md, inline comments)
- [ ] CHANGELOG.md updated if applicable
- [ ] No console.log statements left in production code (unless intentional)
- [ ] All disposables are properly registered and disposed
- [ ] Error handling is comprehensive with user-friendly messages
- [ ] Configuration changes are backwards compatible
- [ ] Commit messages follow Conventional Commits format

## VS Code Extension Specific Guidelines

### Extension API Best Practices

1. **Dispose resources properly**:
   ```typescript
   // Always register disposables
   context.subscriptions.push(disposable);
   
   // Clean up in deactivate()
   export function deactivate() {
       if (manager) {
           manager.dispose();
       }
   }
   ```

2. **Handle file URIs correctly**:
   ```typescript
   // Check URI scheme before operations
   if (editor.document.uri.scheme === 'file') {
       // Safe to perform file operations
   }
   ```

3. **Configuration changes**:
   ```typescript
   // Listen for config changes
   vscode.workspace.onDidChangeConfiguration((event) => {
       if (event.affectsConfiguration('gitBlameOverlay')) {
           // Update behavior
       }
   });
   ```

4. **User-friendly messages**:
   ```typescript
   // Use appropriate message types
   vscode.window.showInformationMessage('Success!');
   vscode.window.showWarningMessage('Warning...');
   vscode.window.showErrorMessage('Error occurred');
   ```

### Configuration Schema

When adding new configuration options:

1. Update `package.json` under `contributes.configuration.properties`
2. Provide clear descriptions and default values
3. Use appropriate types (`string`, `boolean`, `number`, `enum`)
4. Consider backwards compatibility
5. Document in README.md with examples

Example:
```json
"gitBlameOverlay.newSetting": {
    "type": "boolean",
    "default": true,
    "description": "Clear description of what this setting does"
}
```

### Adding New Commands

1. Register in `package.json` under `contributes.commands`:
   ```json
   {
       "command": "git-blame-vsc.commandName",
       "title": "Command Title",
       "category": "Git Blame"
   }
   ```

2. Implement in `extension.ts`:
   ```typescript
   const disposable = vscode.commands.registerCommand(
       'git-blame-vsc.commandName',
       () => {
           // Implementation
       }
   );
   context.subscriptions.push(disposable);
   ```

3. Add to context menus if appropriate (in `package.json` under `contributes.menus`)

### Performance Guidelines

- **Avoid synchronous operations**: Use async/await for I/O
- **Cache expensive operations**: Example: git blame results
- **Debounce frequent events**: Consider debouncing editor selection changes
- **Lazy initialization**: Initialize resources only when needed
- **Efficient decorations**: Clear old decorations before applying new ones

### Security Considerations

- **Command injection**: Never pass unsanitized user input to shell commands
- **File path validation**: Validate file paths before operations
- **Git command safety**: Use proper escaping for git commands
- **Sensitive data**: Never log sensitive information (commit messages are okay, credentials are not)

## Getting Help

- **VS Code Extension API**: https://code.visualstudio.com/api
- **Extension Guidelines**: https://code.visualstudio.com/api/references/extension-guidelines
- **Issue tracker**: Report bugs or ask questions via GitHub Issues
- **Discussions**: For general questions, use GitHub Discussions (if enabled)

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
