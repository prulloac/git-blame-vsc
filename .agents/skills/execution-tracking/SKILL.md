---
name: execution-tracking
description: Track real-time progress of feature implementation against the execution plan, identify blockers, update timelines, and provide feedback for continuous improvement. Use when your team is actively building a feature to monitor progress, escalate issues, and keep the plan synchronized with reality.
---

# Execution Tracking Skill

**Answers the question: How are we tracking against the plan? Are we on schedule? What needs to be unblocked?**

This skill focuses on **real-time progress monitoring, blocker management, and plan synchronization**, transforming the static execution plan into a living, updated document that reflects actual team progress.

## When to Use

Use this skill when you:
- Are actively executing a feature (tasks are in progress)
- Need to track progress against the execution plan created by `feature-planning`
- Have blockers or risks that need escalation
- Need to update timelines based on actual work
- Want to generate burndown reports or progress summaries
- Are approaching a milestone and need verification

**Key indicator**: You're asking "Are we on track?", "What's blocking us?", or "Do we need to adjust the timeline?"

**Do NOT use this skill if**: 
- You haven't yet created an execution plan (use `feature-planning` first)
- You're trying to CREATE an initial timeline from a breakdown (use `feature-planning` first)
- Your team hasn't started building yet (use `feature-planning` to create the plan first)
- You're asking "WHEN will each task be scheduled?" not "HOW are we actually tracking?" (use `feature-planning` first)

**Distinction from feature-planning**:
- **feature-planning**: Creates initial timeline from breakdown (one-time, before execution)
- **execution-tracking**: Monitors real progress against that timeline (ongoing, during execution)
- **Use feature-planning if**: No plan.md exists yet, or team hasn't started working
- **Use execution-tracking if**: plan.md exists AND team is actively building (tasks in progress)

## Prerequisites

⚠️ **CRITICAL**: This skill requires an execution plan as input. Do NOT proceed without it.

Before using this skill:

1. **Verify you have completed `feature-planning` first**
   - If you only have a feature breakdown → Use `feature-planning` to create execution plan first
   - If you have a feature execution plan → Continue below

2. **Expected inputs from feature-planning**:
   - `docs/features/[feature-name]-plan.md` file exists
   - `docs/features/[feature-name]-schedule.md` file exists
   - `docs/features/[feature-name]-team-checklist.md` file exists
   - Contains all required sections with task details, timeline, resource assignments

**If you don't have execution plan files**:
- Load the `feature-planning` skill first
- Follow its workflow to create `plan.md`, `schedule.md`, and `team-checklist.md`
- Once you have all three files, return here

## Inputs

- Execution plan files (required): `plan.md`, `schedule.md`, `team-checklist.md`
- Team progress updates (required): Current status of each task
- Actual timelines (required): When tasks actually started/completed
- Blockers and issues (optional): What's preventing progress
- Resource changes (optional): Team changes, capacity adjustments

## Output Files

When this skill completes, it creates or updates:

1. **Progress Tracker** (`docs/features/[feature-name]-progress.md`)
   - Current status of each task (Not Started, In Progress, Blocked, Complete)
   - Actual timelines vs. planned timelines
   - Blocker list with severity and owner
   - Burndown chart showing progress velocity
   - Risk escalations and timeline adjustments

2. **Blocker Log** (`docs/features/[feature-name]-blockers.md`)
   - Current and resolved blockers
   - Root cause analysis
   - Owner and resolution status
   - Lessons learned for future projects

3. **Updated Schedule** (`docs/features/[feature-name]-schedule-updated.md`)
   - Current schedule with actual dates
   - Critical path adjustments based on real progress
   - Milestone tracking and completion dates
   - Contingency timeline if needed

4. **Phase Completion Report** (generated at phase ends)
   - What was completed in this phase
   - What carried over to next phase
   - Lessons learned
   - Quality metrics (test coverage, code review feedback, etc.)

## Workflow Overview

The execution tracking process transforms a static plan into a dynamic, feedback-driven document:

```
Execution Plan Input
    ↓
Collect Team Status Updates
    ↓
Compare Actual vs. Planned
    ↓
Identify Blockers & Risks
    ↓
Calculate Burndown & Velocity
    ↓
Assess Critical Path Impact
    ↓
Update Timeline & Milestones
    ↓
Generate Progress Reports
    ↓
Adjust Future Phases (if needed)
```

## Core Workflow

### Phase 1: Initialize Progress Tracking

**Input**: Execution plan files

1. **Read execution plan**:
   - Extract all sequenced tasks from plan.md
   - Document task dependencies and critical path
   - Note timeline expectations and milestones
   - Identify resource assignments

2. **Create tracking structure**:
   - Set up task status tracking (Not Started, In Progress, Blocked, Complete, Failed)
   - Initialize progress data file or spreadsheet
   - Set up daily/weekly update frequency
   - Assign progress owner (project manager, tech lead, etc.)

3. **Establish baselines**:
   - Document planned timeline and critical path
   - Establish team velocity baseline if available
   - Set sprint/phase boundaries
   - Document success metrics

### Phase 2: Collect Status Updates

**Frequency**: Daily standup or daily/weekly batch updates

1. **Gather task status**:
   - For each task: Current status (Not Started → In Progress → Complete)
   - Actual start date vs. planned start date
   - Estimated completion date vs. planned completion date
   - Percentage complete (0-100%)
   - Any work completed since last update

2. **Document blockers**:
   - What's preventing progress (if status is "Blocked")
   - Severity (Critical - blocks other tasks, High - delays this task significantly, Medium, Low)
   - Owner responsible for unblocking
   - Expected resolution time
   - Workarounds if any

3. **Track team capacity**:
   - Actual hours spent this period
   - Remaining estimated hours
   - Team member absences or context switches
   - Changes to team composition

### Phase 3: Calculate Progress Metrics

**Calculate regularly (daily or weekly)**

1. **Task completion**:
   - Count of tasks: Not Started, In Progress, Blocked, Complete
   - Percentage of tasks complete
   - Percentage of tasks on critical path that are complete

2. **Timeline metrics**:
   - Tasks completed on schedule vs. late vs. early
   - Average variance from planned to actual (e.g., "running 2 days behind")
   - Critical path completion percentage
   - Projected completion date vs. planned

3. **Burndown calculation**:
   - Remaining task-days of work
   - Planned burndown rate (ideal velocity)
   - Actual burndown rate (observed velocity)
   - Days remaining at current velocity

4. **Velocity trending**:
   - Tasks completed per day/week
   - Average task duration vs. estimated
   - Trend (accelerating, stable, decelerating)

### Phase 4: Identify and Escalate Risks

**Review and update continuously**

1. **Blocker analysis**:
   - List all current blockers by severity
   - Calculate blocker impact (e.g., "3 tasks blocked, 2 days lost")
   - Identify pattern (same issue repeatedly? systemic problem?)
   - Prioritize unblocking efforts

2. **Timeline risk**:
   - Tasks running behind: are they on critical path?
   - Critical path delays: how much impact?
   - Contingency buffer consumption (are we within planned buffer?)
   - Projected miss risk: when will we hit deadline miss?

3. **Quality concerns**:
   - Code review feedback (size, quality issues, patterns)
   - Test failures and pass rate
   - Performance regressions
   - Technical debt accumulation

4. **Escalation triggers**:
   - If critical task is >2 days behind critical path
   - If blocker unresolved >1 day and high impact
   - If team velocity drops >30% from baseline
   - If projected miss of deadline

### Phase 5: Update Plan and Timeline

**When changes occur**

1. **Adjust task timeline**:
   - For tasks in progress: update estimated completion based on actual progress
   - For pending tasks: shift timeline based on upstream delays
   - Recalculate phase completion dates
   - Identify new critical path if dependencies shifted

2. **Update critical path**:
   - Recalculate longest dependency chain with actual progress
   - Are different tasks now on critical path?
   - Shift resource focus to new critical path if needed
   - Communicate changes to team

3. **Manage scope**:
   - If timeline pressure emerges, identify scope reduction options
   - Document what could be deferred to post-launch or future phases
   - Get stakeholder agreement on any scope changes
   - Update acceptance criteria if scope changes

4. **Contingency activation**:
   - If consuming planned contingency buffer, activate contingency plans
   - Consider options: scope reduction, timeline extension, resource addition
   - Document decision rationale

### Phase 6: Generate Progress Reports

**Generate on schedule (daily, weekly, or at phase gates)**

1. **Daily standup report** (if daily updates):
   - Summary of what was completed yesterday
   - What's planned for today
   - Any blockers or risks raised
   - Quick status: On track / At risk / Off track

2. **Weekly progress report**:
   - Tasks completed this week
   - Tasks in progress (% complete)
   - Blockers this week and resolution
   - Velocity this week vs. planned
   - Updated timeline projection
   - Key decisions or changes
   - Next week priorities

3. **Phase completion report** (at end of each phase):
   - All tasks completed in this phase
   - Tasks carried over (if any) with reason
   - Quality metrics: test coverage, code review quality, performance
   - Lessons learned
   - Risk/blockers from this phase
   - Preparation for next phase
   - Resource utilization and team velocity

### Phase 7: Conduct Phase Reviews and Continuous Improvement

**At end of each phase and project**

1. **Phase gate review**:
   - Did phase meet acceptance criteria?
   - Are deliverables ready for next phase?
   - Quality gates passed?
   - Team satisfied with progress?

2. **Lessons learned**:
   - What went well? (celebrate wins)
   - What was harder than expected?
   - What blockers should be prevented next time?
   - What estimates were off and why?
   - Feedback for next feature planning

3. **Team retrospective** (optional but recommended):
   - What worked in this execution?
   - What should we change for next feature?
   - Any process improvements?
   - Team morale and workload assessment

## Guidelines

### Status Definitions

**Not Started**: Task hasn't begun. Waiting for dependencies or scheduling.

**In Progress**: Task is actively being worked. Has start date, estimated completion date, and owner.

**Blocked**: Task started but stopped due to external blocker. Blocker documented with severity and expected resolution.

**Complete**: Task finished, acceptance criteria met, code merged, tests passing.

**Failed**: Task attempted but needs rework or cancellation. Document why and next steps.

### Blocker Severity

- **Critical**: Blocks multiple tasks, project at risk, needs immediate escalation
- **High**: Delays this task significantly, impacts critical path, needs quick resolution
- **Medium**: Delays this task somewhat, workarounds available, can escalate if persists
- **Low**: Minor inconvenience, can often be worked around

### Progress Tracking Best Practices

✅ **Update progress daily** - More frequent updates mean earlier risk detection
✅ **Be honest about timelines** - Underreporting blockers delays response
✅ **Track blockers to resolution** - Don't just identify, follow to unblocking
✅ **Communicate early** - If you see timeline risk, escalate immediately
✅ **Celebrate milestones** - When phases complete, recognize team effort
✅ **Document lessons learned** - Continuous improvement for next feature

### Timeline Adjustment Rules

1. **Changes to critical path**: Recalculate and communicate immediately
2. **Deadline miss prediction**: Escalate to stakeholders with options
3. **Scope change**: Get stakeholder approval before proceeding
4. **Resource change**: Update resource assignments and capacity planning
5. **Buffer consumption**: If >50% of contingency used, activate contingency plans

## Common Pitfalls to Avoid

❌ **Ignoring early warning signs**: Small delays compound into large ones
❌ **Reporting progress inaccurately**: "Almost done" isn't 95% - be precise
❌ **Not escalating blockers**: Hoping issues resolve on their own rarely works
❌ **Scope creep without tracking**: New work added but not counted against timeline
❌ **No contingency management**: When buffer is needed, it's already gone
❌ **Siloed communication**: Stakeholders surprised by delays announced at end
❌ **Not adjusting for actual velocity**: Sticking to original plan despite real progress shows progress metric misalignment

## See Also

For reference materials on execution tracking, see the included reference documents in the skill's `references/` directory.

- `progress-tracking-template.md`: Spreadsheet or format for daily tracking
- `blocker-log-template.md`: How to document and track blockers
- `phase-report-template.md`: Template for phase completion reports
- `retrospective-template.md`: Questions for continuous improvement

## Example: Execution Tracking Output

For a real example of how this output looks, see: `references/example-execution-tracking.md`
