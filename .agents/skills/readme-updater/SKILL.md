---
name: readme-updater
description: Use this skill when you need to keep a repository's README.md file updated with project metadata, installation instructions, usage examples, and more. It automates synchronization by analyzing codebase patterns and dependencies.
---

# README Updater

This skill helps maintain a consistent and up-to-date `README.md` file for your repository. It automates the process of extracting information from the project's codebase to ensure documentation is always in sync with implementation.

## Features

1.  **Project Overview Synchronization**: Updates the project description and features list based on the latest implementation.
2.  **Installation & Setup Tracking**: Automatically detects project type (Node.js, Python, Rust, etc.) and updates setup/installation commands.
3.  **Usage Examples Generator**: Scrapes code examples from test suites or `examples/` directory and integrates them into the README.
4.  **Version and Changelog Linking**: Keeps the current version and links to the `CHANGELOG.md` updated.
5.  **Dependency Visualization**: Optionally generates or updates a list of main dependencies or a simple architecture overview.

## Workflow

### 1. Analyze the Workspace

Before updating, the agent must gather context about the project's current state.

- **Check root files**: Look for `package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, etc.
- **Determine project type**: Identify the primary language and frameworks used.
- **Locate entry points**: Find the main script or binary that users will interact with.

### 2. Update the README.md

#### A. If `README.md` does not exist:
Create a new `README.md` using the [Standard Template](references/readme_template.md).

#### B. If `README.md` exists:
Analyze the current contents and identify sections that need updates.

1.  Use search tools to find markers or specific headers (e.g., `# Installation`, `# Usage`).
2.  Propose changes that reflect the latest version or new features.
3.  Maintain existing information that isn't automatically derivable.

### 3. Verification

Always verify the README's correctness after an update:
- Check that links are valid and pointing to the correct files.
- Ensure commands are correct and up-to-date.
- Validate that the tone remains consistent with the rest of the documentation.

## Output Format Example

When the skill completes an update, it should provide a summary of changes:

### README Update Summary

- ✅ **Installation**: Updated `npm install` to include new peer dependencies.
- ✅ **Usage**: Added example for the new `--blame-only` flag.
- ℹ️ **Version**: Incremented to `v1.2.3` to match `package.json`.

## References

- [README Template](references/readme_template.md) - Standard layout for project documentation.
- [Project Discovery Patterns](references/discovery_patterns.md) - How to find project info across different languages.
