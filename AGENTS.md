# Agent Guidelines

This document provides guidance for all agents working within this repository, including skill selection, feature planning workflows, and key conventions.

---

## General Agent Guidelines

- **Handle Uncertainty First**: Always ask for clarification if task scope or technical approach is ambiguous.
- **Workflow Planning**: For any task requiring more than 2 steps, mandatory use of the `manage_todo_list` tool is required to track progress.
- **Skill Over Inference**: Prioritize using repository-specific tools and skills over generic training data to mitigate model hallucination and bias.
- **Tool Selection**: Use specialized tools (MCP, internal scripts) instead of bash commands whenever possible to improve reliability.
- **Context Management**: When exploring large codebases, prefer sub-agents with the Task tool to limit main-agent context bloat.
- **Code References**: Always use the reference pattern `[relative/path/to/file.ext](relative/path/to/file.ext#L10)` for easy editor navigation.

### Common Tool Selection Pitfalls

When choosing between tools, follow these rules to avoid common mistakes:

- **File Operations**: Always use dedicated tools (Read, Edit, Write, Glob, Grep) instead of bash commands (cat, sed, echo, grep). This provides better parsing and error handling.
- **Search Tasks**: Use Task tool with "explore" agent for open-ended codebase searches requiring multiple patterns or locations. Use Grep/Glob directly only for simple, targeted single-pattern searches.
- **Parallel Execution**: Call independent tools in parallel within a single message. Only sequence tool calls when later calls depend on earlier results.
- **Git Operations**: Use bash for git commands. Use Bash tool directly (not tasks) for commit workflows, status checks, and repository operations.
- **Documentation**: Create documentation files only when explicitly requested. Avoid proactively generating README or markdown files.

---

## Code Generation & Review

### Code Generation Guidelines
- **Project Structure Alignment**: New code must align with established patterns in the repository (e.g., VS Code extension architecture).
- **TypeScript First**: All new extension logic must be written in TypeScript with strict typing.
- **DRY (Don't Repeat Yourself)**: Always search for existing utilities or patterns before implementing new ones.
- **Minimalist Complexity**: Prefer simpler implementations that are easier to maintain over clever but opaque code.

### Code Review Guidelines
- **Security Check**: Verify that new code does not introduce security vulnerabilities (e.g., shell injection in `run_in_terminal` commands).
- **Performance Awareness**: For VS Code extensions, ensure logic and event handlers do not block the main UI thread.
- **Test Alignment**: New code should be accompanied by relevant unit or integration tests, following the repository's test framework.
- **Error Handling**: Every major operation (API calls, file I/O) must have robust error handling and user-facing reporting.

### VS Code Extension Command Naming

**CRITICAL**: All VS Code commands for this extension MUST include the "Git Blame: " prefix.

- **Command Title Format**: `Git Blame: <Command Description>`
- **Examples**:
  - ✅ `Git Blame: Show Blame Information`
  - ✅ `Git Blame: Toggle Inline Blame`
  - ✅ `Git Blame: Clear Cache`
  - ❌ `Show Blame Information` (missing prefix)
  - ❌ `Toggle Inline Blame` (missing prefix)

This prefix ensures:
1. Users can easily identify commands belonging to this extension
2. Commands are grouped together in the Command Palette
3. Consistent branding across all extension functionality

When registering commands in `package.json` or TypeScript code, always use the full "Git Blame: " prefix in the command title/label.

---

## 🔴 MANDATORY: File Organization Requirement

**All feature planning and execution files MUST follow this structure:**

```
docs/features/<feature-name>/
├── breakdown.md                 (from feature-breakdown skill)
├── implementation-sequence.md   (from feature-planning skill)
├── implementation-progress.md   (from ai-agent-implementation skill)
├── blockers.md                  (from ai-agent-implementation skill)
└── session-summary-[N].md       (from ai-agent-implementation skill)
```

**Examples**:
```
docs/features/user-authentication/
├── breakdown.md
├── implementation-sequence.md
├── implementation-progress.md
├── blockers.md
├── session-summary-1.md
└── session-summary-2.md

docs/features/payment-processing/
├── breakdown.md
├── implementation-sequence.md
└── ...
```

**VIOLATION CONSEQUENCES**:
- ❌ Files like `docs/features/user-authentication-breakdown.md` (flat structure) are NOT ALLOWED
- ❌ Files in wrong directories are NOT ALLOWED
- ✅ All files MUST be in feature-specific subdirectories with representative names

**File Naming Rules**:
- Use kebab-case for feature names: `user-authentication`, `payment-processing`, `admin-dashboard`
- Create directory: `mkdir -p docs/features/[feature-name]`
- Use descriptive, lowercase filenames: `breakdown.md`, `implementation-sequence.md`, `blockers.md`
- Never use feature-name as prefix in filename (that's what directory is for)

---

## Feature Planning Skills Disambiguation

This repository includes complementary skills for feature planning and execution tracking that work sequentially. **It is critical that you select the correct skill** based on your current phase and inputs.

### Quick Reference (TL;DR)

Use this table to quickly determine which skill you need:

| Your Question | Use This Skill | Input | Output |
|---------------|----------------|-------|--------|
| "What all needs to be built?" | **feature-breakdown** | Feature spec or idea | `breakdown.md` with tasks & criteria |
| "When will each task happen?" | **feature-planning** | `breakdown.md` | `implementation-sequence.md` |
| "Are we on schedule?" | **execution-tracking** | `implementation-sequence.md` | Progress updates & blockers |

**Critical Rule**: feature-breakdown → feature-planning → execution-tracking (one feeds into the next)

### Real-World Example

**Scenario**: "I want to build user authentication"

1. **Planning Phase**:
   - You say: "I need to figure out what all needs to be built"
   - Use: **feature-breakdown**
   - Output: breakdown.md with ~20 tasks, acceptance criteria, testing approach

2. **Sequencing Phase**:
   - You say: "Now I need to know when we can deliver this and who does what"
   - Use: **feature-planning**
   - Output: implementation-sequence.md with timeline, dependencies, assignments

3. **Execution Phase**:
   - You say: "Team is actively building, I need to track progress"
   - Use: **execution-tracking**
   - Output: Daily/weekly progress updates, blocker tracking, timeline adjustments

### Detailed Skill Guidance

#### feature-breakdown
- **When to use**: You have a spec or idea, but no task list yet
- **Input**: Feature specification, requirements, or high-level idea
- **Output**: `breakdown.md` containing decomposed tasks with acceptance criteria
- **Answers**: What needs to be built? How do we verify each piece? What's the scope?
- **Does NOT answer**: ❌ When will tasks happen? Who does it? What's the critical path?

#### feature-planning
- **When to use**: You have a breakdown.md and need a timeline
- **Input**: `breakdown.md` (output from feature-breakdown)
- **Output**: `implementation-sequence.md` with sequencing, timeline, and resource assignments
- **Answers**: What order? When does each task happen (calendar dates)? Who does what?
- **Does NOT answer**: ❌ What tasks exist? How do we verify? What are acceptance criteria?
- **Critical Prerequisite**: MUST have breakdown.md first

#### execution-tracking
- **When to use**: Team is actively building and you need to monitor progress
- **Input**: `implementation-sequence.md` (output from feature-planning)
- **Output**: Progress reports, blocker tracking, timeline adjustments
- **Answers**: Are we on schedule? What's blocking us? Do we need to adjust timeline?
- **Does NOT answer**: ❌ What tasks exist? What's the initial timeline?
- **Critical Prerequisite**: MUST have implementation-sequence.md first

### Skill Selection Decision Tree

Start here to pick the right skill:

```
Do you already have a breakdown.md?
├─ NO → Do you have a feature spec or idea?
│        ├─ YES → Use feature-breakdown ✓
│        └─ NO → Ask for clarification: What feature are you planning?
│
└─ YES → Do you already have an implementation-sequence.md?
         ├─ NO → Use feature-planning ✓
         └─ YES → Is your team actively building?
                  ├─ YES → Use execution-tracking ✓
                  └─ NO → You're done planning! Ready to start building.
```

### Common Confusion Points

| Confusion | Clarification |
|-----------|---------------|
| "Both skills have tasks" | **breakdown**: abstract effort (Small/Med/Large) vs **planning**: concrete dates (Feb 24, Mar 6) |
| "Both mention milestones" | **breakdown**: "code review complete" vs **planning**: "March 15 - launch date" |
| "Can I skip breakdown?" | **NO** — You must know all tasks before scheduling them. It's like planning meetings before knowing which meetings you need. |
| "When do I use tracking?" | **After** planning starts but **before** the team completes all work. It monitors actual vs. planned progress. |

### How to Load and Use a Skill

```bash
# Load the skill
skill feature-breakdown
# or
skill feature-planning
# or
skill execution-tracking

# Then follow the workflow phases in the skill documentation
# and generate output files to: docs/features/[feature-name]/
```

See individual skill documentation (feature-breakdown, feature-planning, execution-tracking) for detailed workflows, phases, and output specifications.

### execution-tracking: Special Notes

The execution-tracking skill monitors real-world progress against planned timelines and is used when:
- Team is actively building (at least one task is in progress)
- An implementation-sequence.md exists from feature-planning
- You need to identify blockers, slippage, or timeline adjustments
- Daily/weekly status updates are required

**Key Differences**:
- **feature-planning** asks "What should we do?" (plan doesn't exist yet)
- **execution-tracking** asks "What are we actually doing?" (plan exists, tracking reality)

**When NOT to use execution-tracking**:
- ❌ No plan exists yet → Use feature-planning first
- ❌ Team hasn't started → Use feature-planning for timeline
- ❌ Need to identify all tasks → Use feature-breakdown

For detailed tracking workflows and progress report templates, see the execution-tracking skill documentation.

---
