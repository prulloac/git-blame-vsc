# Feature Summary Generator Workflow

This workflow automatically generates feature summary documents when a feature request or enhancement is accepted.

## How It Works

1. **Trigger**: When an issue is labeled with `accepted`
2. **Condition**: Only runs for issues with `enhancement` label or titles containing `[Feature]` or `[Enhancement]`
3. **Process**:
   - Extracts issue details (title, description, number)
   - Creates a feature directory: `docs/features/<feature-name>/`
   - Attempts to run OpenCode with the `feature-summary` skill
   - Generates a comprehensive feature summary document
   - Creates a new branch and pull request with the summary
   - Comments on the original issue with next steps

## Setup Requirements

### 1. GitHub Token (Already Configured)

The workflow uses the default `GITHUB_TOKEN` which is automatically provided by GitHub Actions.

### 2. OpenCode API Key (Optional - For Full Automation)

If you want the workflow to use OpenCode's AI capabilities, you need to add an OpenCode API key:

1. Go to your repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `OPENCODE_API_KEY`
4. Value: Your OpenCode API key
5. Click "Add secret"

**Without the API key**: The workflow will still create a basic feature summary template that you can fill in manually.

## Usage

### Step 1: Create a Feature Request or Enhancement

Use the GitHub issue templates to create a feature request or enhancement:
- Go to Issues → New Issue
- Select "✨ Feature Request" or "🔧 Feature Enhancement"
- Fill in all required fields
- Submit the issue

### Step 2: Review and Accept

After reviewing the feature request:
1. Add the `accepted` label to the issue
2. The workflow will automatically trigger

### Step 3: Monitor Progress

1. Go to the Actions tab to see the workflow running
2. The workflow will:
   - Create a feature summary document
   - Open a pull request with the summary
   - Comment on the original issue with a link to the PR

### Step 4: Review and Merge

1. Review the generated feature summary in the PR
2. Make any necessary edits to the summary
3. Merge the PR to add it to the repository

## Output Structure

The workflow creates files in this structure:

```
docs/features/<feature-name>/
└── summary.md          # Comprehensive feature summary
```

Example for a feature titled "Add keyboard shortcuts":
```
docs/features/add-keyboard-shortcuts/
└── summary.md
```

## What's in the Feature Summary?

The generated summary typically includes:

- **Overview**: High-level description of the feature
- **Business Value**: Why this feature matters
- **User Stories**: How users will interact with it
- **Technical Approach**: Implementation considerations
- **Success Metrics**: How to measure success
- **Timeline Estimates**: Rough effort estimates
- **Dependencies**: What needs to exist first
- **Risks**: Potential challenges

## Next Steps After Summary Creation

Once the feature summary is merged:

1. **Feature Breakdown**: Use the `feature-breakdown` skill to decompose the feature into tasks
   ```bash
   # In your local repository
   opencode
   # Then: "Load feature-breakdown skill and create breakdown for docs/features/<feature-name>/summary.md"
   ```

2. **Feature Planning**: Use the `feature-planning` skill to sequence tasks
   ```bash
   # After breakdown is complete
   opencode
   # Then: "Load feature-planning skill and create implementation sequence"
   ```

3. **Implementation**: Start building according to the plan!

## Troubleshooting

### Workflow doesn't trigger
- Ensure the issue has the `accepted` label
- Ensure the issue has `enhancement` label OR title contains `[Feature]` or `[Enhancement]`
- Check the Actions tab for any errors

### OpenCode fails
- If `OPENCODE_API_KEY` is not set, the workflow will create a basic template instead
- Check the workflow logs for specific error messages
- You can always create the summary manually using OpenCode locally

### Pull request creation fails
- Check repository permissions in Settings → Actions → General
- Ensure "Allow GitHub Actions to create and approve pull requests" is enabled

## Manual Alternative

If the automated workflow fails or you prefer manual control:

```bash
# 1. Create the feature directory
mkdir -p docs/features/<feature-name>

# 2. Run OpenCode locally
opencode

# 3. In OpenCode, run:
# "Load the feature-summary skill and create a summary for issue #<number>"

# 4. Commit and push
git add docs/features/<feature-name>/
git commit -m "feat: add feature summary for issue #<number>"
git push
```

## Configuration

### Changing the base branch

Edit `.github/workflows/feature-summary-generator.yml`:

```yaml
base: 'main'  # Change to 'master' or your default branch
```

### Adjusting timeout

The workflow has a 30-minute timeout. To change it:

```yaml
timeout-minutes: 30  # Increase if needed
```

### Customizing feature name extraction

The workflow converts issue titles to kebab-case feature names. To customize this logic, edit the "Get issue details" step.

## Labels Used

- `accepted` - Triggers the workflow
- `enhancement` - Identifies feature requests/enhancements
- `documentation` - Auto-added to the PR
- `automated` - Auto-added to the PR

---

**Related Workflows:**
- CI (`.github/workflows/ci.yml`) - Runs tests
- PR Checks (`.github/workflows/pr-checks.yml`) - Auto-labels PRs
- Release (`.github/workflows/release.yml`) - Creates releases

**Related Skills:**
- `feature-summary` - Creates comprehensive feature documentation
- `feature-breakdown` - Decomposes features into tasks  
- `feature-planning` - Sequences tasks for implementation
