# Git Blame VSC

![GitHub stars](https://img.shields.io/github/stars/prulloac/git-blame-vsc)
![GitHub issues](https://img.shields.io/github/issues/prulloac/git-blame-vsc)

A lightweight Visual Studio Code extension that helps you see an inline git blame summary directly on the editor. It provides real-time commit metadata (author, date, summary) for the current line you are editing.

## Features

- **Inline Git Blame**: Displays commit information at the end of the current line.
- **Commit Metadata**: See the author, timestamp, and commit message (summary) at a glance.
- **Language Agnostic**: Works across all languages supported by VS Code's editor.
- **Lightweight**: Optimized for performance and minimal editor distraction.

## Installation

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) (v1.85.0 or later)
- [Git](https://git-scm.com/) installed on your local machine.

### Quick Start

```bash
# Clone the repository
git clone https://github.com/prulloac/git-blame-vsc.git
cd git-blame-vsc

# Install dependencies (once package.json is initialized)
npm install
```

## Usage

Once installed and activated, simply move your cursor to any line in a file that is part of a Git repository. A subtle inline message will appear at the end of the line showing the last commit information.

### Examples

| Display Inline | Commit Summary |
|---|---|
| `const x = 10; // Pablo Ulloa, 2 hours ago • Updated constant` | Full commit history available via the VS Code command palette. |

## Configuration

Settings can be customized in `.vscode/settings.json`:

- `gitBlameVsc.enabled`: Toggle the inline summary on/off.
- `gitBlameVsc.template`: Customize the inline text format.

## Contributing

Contributions are welcome! Please read the `CONTRIBUTING.md` (coming soon) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Git CLI](https://git-scm.com/docs)
