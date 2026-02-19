# Agent Guidelines

This document provides guidance for all agents working within this repository, including skill selection, feature planning workflows, and key conventions.

---

## 🔴 MANDATORY: File Organization Requirement

**All feature planning and execution files MUST follow this structure:**

```
docs/features/<feature-name>/
├── breakdown.md                 (from feature-breakdown skill)
├── implementation-sequence.md        (from feature-planning skill)
├── implementation-progress.md        (from ai-agent-implementation skill)
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

## General Agent Guidelines

- **Handle Uncertainty First**: Always ask for clarification if task scope or technical approach is ambiguous.
- **Workflow Planning**: For any task requiring more than 2 steps, mandatory use of the `manage_todo_list` tool is required to track progress.
- **Skill Over Inference**: Prioritize using repository-specific tools and skills over generic training data to mitigate model hallucination and bias.
- **Tool Selection**: Use specialized tools (MCP, internal scripts) instead of bash commands whenever possible to improve reliability.
- **Context Management**: When exploring large codebases, prefer sub-agents with the Task tool to limit main-agent context bloat.
- **Code References**: Always use the reference pattern `[relative/path/to/file.ext](relative/path/to/file.ext#L10)` for easy editor navigation.

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

---

## Feature Planning Skills Disambiguation

This repository includes two complementary skills for feature planning that work sequentially. **It is critical that you select the correct skill** based on your current state and inputs.

### Quick Decision Tree

```
Do you have a feature spec or idea?
├─ YES → Do you already have a list of tasks with acceptance criteria?
│         ├─ NO → Use feature-breakdown
│         │       (identify ALL tasks and HOW to verify them)
│         └─ YES → Do you need timelines and resource assignments?
│                  ├─ YES → Use feature-planning
│                  │        (sequence, schedule, assign to team)
│                  └─ NO → You're done! No skill needed
│
└─ NO → Do you have a feature breakdown document?
        ├─ YES → Use feature-planning
        │        (create timeline and execution plan)
        └─ NO → Start with feature-breakdown first
```

### Skill Comparison Matrix

| Aspect | feature-breakdown | feature-planning |
|--------|-------------------|------------------|
| **Input** | Feature spec, idea | Breakdown document |
| **Output** | Task list + acceptance criteria | Timeline + schedule |
| **Main Focus** | WHAT + HOW to verify | WHEN + WHO |
| **Concerns** | Components, scope, validation | Dependencies, timeline, resources |
| **Time Discussion** | Effort estimates (Small/Med/Large) | Calendar dates & milestones |
| **Resource Discussion** | None | Team assignments & utilization |
| **Answers These** | What needs building? How do we verify? | When will tasks happen? Who does what? |
| **Output Files** | `breakdown.md` | `plan.md`, `schedule.md`, `checklist.md` |

### Clear Distinctions

#### feature-breakdown
- **Input**: Feature spec, idea, or requirements document
- **Output**: Structured breakdown with tasks, acceptance criteria, validation approaches
- **Focus**: DECOMPOSITION and VALIDATION
- **Prerequisite**: Must be done BEFORE feature-planning

**Answers**:
- What needs to be built?
- What are all the components?
- How many tasks are required?
- How do we verify each task is complete?
- What's the scope and are we missing anything?

**Does NOT answer**:
- ❌ When will each task start/end?
- ❌ Who will do each task?
- ❌ What's the critical path?
- ❌ What are realistic calendar dates?
- ❌ How long will the project take?

#### feature-planning
- **Input**: Feature breakdown document (output from feature-breakdown skill)
- **Output**: Time-bound execution plan with sequences, timelines, resources
- **Focus**: SEQUENCING, SCHEDULING, and RESOURCE ALLOCATION
- **Prerequisite**: Requires feature-breakdown to be completed first

**Answers**:
- In what order should tasks happen?
- What's the critical path (longest dependency chain)?
- When does each task start/end (calendar dates)?
- Who should do each task (resource assignment)?
- What's the total project timeline?
- What are realistic buffers and contingencies?
- What are the major milestones?

**Does NOT answer**:
- ❌ What tasks need to be done? (feature-breakdown answers this)
- ❌ How do we verify each task? (feature-breakdown answers this)
- ❌ What are acceptance criteria? (feature-breakdown answers this)

### The Input/Output Chain

```
Feature Spec
    ↓
    └─→ feature-breakdown ─→ Breakdown Document
                                ↓
                                └─→ feature-planning ─→ Execution Plan
                                                        ↓
                                                        (Ready for team!)
```

**Critical**: Each skill feeds into the next. Skipping feature-breakdown to use feature-planning would be like trying to schedule meetings before knowing what meetings you need to have.

### Real-World Example

**Scenario**: "I want to build user authentication"

**If user says**: "I need to figure out what all needs to be built for authentication"
→ **Use feature-breakdown**
- Creates: breakdown document with 20+ tasks, acceptance criteria, testing approach

**Then user says**: "Great, now I need to know when we can deliver this and who does what"
→ **Use feature-planning**
- Takes the breakdown and creates: timeline, task sequences, resource assignments

**Critical**: Cannot skip to planning without the breakdown first—you must know what all the tasks are before deciding when they happen.

### Common Confusion Points to Avoid

**❌ Confusion 1**: "Both have tasks and schedules"
- **feature-breakdown**: Tasks with effort estimates (Small/Med/Large - abstract)
- **feature-planning**: Tasks with calendar dates (Feb 24, Mar 6, etc. - concrete)

**❌ Confusion 2**: "Both mention milestones"
- **feature-breakdown**: Milestones are completion checkpoints ("all tests pass")
- **feature-planning**: Milestones are calendar dates ("March 15 - Feature launch")

**❌ Confusion 3**: "Both create plans"
- **feature-breakdown**: Plan = "here's what needs to be done"
- **feature-planning**: Plan = "here's how to do it, step by step, on a timeline"

**✅ Clear distinction**:
- **feature-breakdown** answers: "What's our definition of done?"
- **feature-planning** answers: "When will we be done?"

### How to Select the Correct Skill

**When user says**: "I have a feature idea and need a plan"
1. First check: Does user have a breakdown document?
   - NO → Use feature-breakdown
   - YES → Use feature-planning

**When user says**: "I need to create a timeline"
- Check: Do you have a feature breakdown (list of tasks)?
   - NO → Must do feature-breakdown first
   - YES → Use feature-planning

**When user says**: "I need to figure out all the work"
- Use feature-breakdown (regardless of other context)

**When user says**: "I need to assign work to my team"
- Must have breakdown first
- Then use feature-planning

**CRITICAL DISTINCTION** (prevents confusion between planning and execution-tracking):

**When user says**: "I need to create/generate a timeline" OR "Timeline doesn't exist yet"
- Use **feature-planning** (creates the initial plan and timeline)

**When user says**: "I need to track/monitor/update progress" OR "Team is actively building"
- Use **execution-tracking** (monitors actual progress against existing plan)

| Situation | Use This Skill |
|-----------|----------------|
| Creating timeline for first time | feature-planning |
| Team hasn't started building yet | feature-planning |
| Asking "What's the schedule?" (planning phase) | feature-planning |
| plan.md doesn't exist yet | feature-planning |
| Team is actively building (tasks in progress) | execution-tracking |
| Asking "Are we on schedule?" (during execution) | execution-tracking |
| Need to track blockers and issues | execution-tracking |
| Need daily/weekly progress reports | execution-tracking |
| Have plan.md and need to update it with real data | execution-tracking |

### AI Keyword Algorithm for Skill Selection

Use this algorithm to select the correct skill when user request contains ambiguous keywords:

**Step 1: Check for explicit state keywords** (highest priority)

```
If user says: "actively building" OR "team is working" OR "team is developing"
  → Use execution-tracking (team is actively executing)

If user says: "haven't started" OR "before we start" OR "planning phase"
  → Use feature-breakdown or feature-planning (pre-execution)

If user says: "no plan exists" OR "create a plan" OR "build a plan"
  → Use feature-planning (execution plan doesn't exist)

If user says: "have a plan" AND "tracking" OR "monitoring"
  → Use execution-tracking (plan exists, need to monitor)
```

**Step 2: Analyze verb phrases** (if Step 1 is ambiguous)

```
Verbs that indicate CREATE/PLAN (use feature-planning):
  "create", "generate", "build", "make", "design", "schedule", "sequence"
  
Verbs that indicate MONITOR/TRACK (use execution-tracking):
  "track", "monitor", "report", "update", "check", "assess", "follow", "compare"

Verbs that indicate DECOMPOSE (use feature-breakdown):
  "break down", "decompose", "analyze", "identify", "list", "specify"

Example:
  "I need to create a timeline" → CREATE verb → feature-planning ✅
  "I need to track progress" → TRACK verb → execution-tracking ✅
  "I need to identify all tasks" → DECOMPOSE verb → feature-breakdown ✅
```

**Step 3: Check file existence** (if verbs are ambiguous)

```
If user references: "breakdown.md"
  → Next skill is feature-planning

If user references: "plan.md" OR "schedule.md" OR "team-checklist.md"
  → Next skill is execution-tracking

If user references: "no files yet" OR "just a spec"
  → Start with feature-breakdown
```

**Step 4: Keyword frequency analysis** (last resort for ambiguous requests)

```
Tally keywords from user request:

Planning keywords (use feature-planning if 3+):
  timeline, schedule, dates, deadline, phases, assign, resources, sequence, 
  dependencies, critical path, milestone, when, duration

Execution keywords (use execution-tracking if 3+):
  progress, tracking, blocker, status, actual, real, velocity, burndown, 
  sprint, daily, weekly, on-track, delay, slip, adjustment

Breakdown keywords (use feature-breakdown if 3+):
  what, specification, component, architecture, acceptance, criteria, 
  validate, verify, testing, scope, decompose, tasks
```

**Complete Decision Tree (for AI agents)**

```
START
  |
  ├─ User has active team building? (keywords: "actively", "team is", "in progress")
  │   ├─ YES → EXECUTION-TRACKING ✓
  │   └─ NO → Continue
  │
  ├─ User asking to CREATE plan? (keywords: "create", "generate", "build", "schedule")
  │   ├─ YES → FEATURE-PLANNING ✓
  │   └─ NO → Continue
  │
  ├─ User asking to TRACK/MONITOR? (keywords: "track", "monitor", "report", "progress")
  │   ├─ YES → Check if plan.md exists
  │   │         ├─ EXISTS → EXECUTION-TRACKING ✓
  │   │         └─ NOT EXISTS → FEATURE-PLANNING first, then EXECUTION-TRACKING
  │   └─ NO → Continue
  │
  ├─ User asking to IDENTIFY work? (keywords: "what", "identify", "decompose", "break down")
  │   ├─ YES → FEATURE-BREAKDOWN ✓
  │   └─ NO → Continue
  │
  ├─ Check file references
  │   ├─ "breakdown.md" exists → FEATURE-PLANNING ✓
  │   ├─ "plan.md" exists → EXECUTION-TRACKING ✓
  │   └─ NO files exist → FEATURE-BREAKDOWN ✓
  │
  └─ DEFAULT: Ask user for clarification
      "Are you trying to: (A) identify what work is needed, (B) create a timeline, 
       or (C) track progress against an existing plan?"
```

### Skill Loading

To use either skill:
1. Load the skill using: `skill feature-breakdown` or `skill feature-planning`
2. Provide the appropriate input (spec for breakdown, breakdown doc for planning)
3. Follow the workflow phases in the skill
4. Generate the output files to the specified location

See the individual skill documentation for detailed workflows, phases, and output specifications.

---
