# Format Contract: Feature Planning → Execution Tracking

This document defines the interface contract between `feature-planning` and `execution-tracking` skills. It ensures safe, predictable handoff of execution plan data from planning to tracking.

## Purpose

The format contract ensures that:
1. `feature-planning` produces outputs that `execution-tracking` can reliably consume
2. `execution-tracking` knows exactly what to expect and how to parse execution plan files
3. If either skill changes format, both must be updated in lockstep
4. Tools can validate format compliance before execution-tracking starts
5. Prevents confusion between "create plan" (planning) and "track plan" (execution)

---

## Input Format: Execution Plan File Structure

**Files Required**: All three must exist for execution-tracking to function

### 1. Feature Plan File
**File Location**: `docs/features/[feature-name]-plan.md`

**Required Sections** (in order):
1. Executive Summary
2. Task Sequence Map
3. Detailed Task List
4. Timeline & Milestones
5. Resource Plan
6. Risk & Mitigation
7. Verification & Sign-Off
8. Next Steps

**Each Task Must Include**:
```
## Task [Phase]-[Seq]: [Task Title]

**Phase**: [Phase name and number]
**Component**: [Component name(s)]
**Sequence**: [Sequential position]
**Depends On**: [Task IDs or "None"]
**Parallel With**: [Other task IDs or "None"]
**Assigned To**: [Person/Role or "TBD"]
**Timeline**: 
  - Start: [Date or milestone]
  - Duration: [N days]
  - End: [Date]
**Acceptance Criteria**:
  - [ ] Criterion 1
  - [ ] Criterion 2
**Verification Method**: [How will this be validated?]
**Risk Assessment**: [Risks specific to this task]
**Mitigation**: [If risk identified, strategy]
```

### 2. Feature Schedule File
**File Location**: `docs/features/[feature-name]-schedule.md`

**Required Sections**:
1. Timeline Summary (start/end dates, total duration)
2. Phase Breakdown (7 phases with dates)
3. Milestone Dates
4. Critical Path Identification
5. Resource Allocation Timeline
6. Contingency Planning
7. Sprint/Week Breakdown (if applicable)

**Gantt Format** (text-based):
```
[Task] [Weeks: 1 2 3 4 5 6]
Phase 1 |████|
Phase 2    |████████|
Phase 3       |████|
```

### 3. Team Checklist File
**File Location**: `docs/features/[feature-name]-team-checklist.md`

**Required Content**:
1. Task Checklist (all tasks with status)
2. Dependencies Map
3. Blocker Definition
4. Sign-Off Tracking
5. Phase Gates

**Format**:
```
## Task Checklist

- [ ] Task 1-1: [Name] - [Owner] - Due [Date]
- [ ] Task 1-2: [Name] - [Owner] - Due [Date]

## Blockers List

- [ ] Blocker 1: [Description] - [Owner] - Severity: [High/Med/Low]

## Sign-Off Tracking

- [ ] Phase 1 Completion: [Name] - [Date]
- [ ] Phase 2 Completion: [Name] - [Date]
```

---

## Validation Checklist for Execution-Tracking

Before proceeding with execution-tracking, verify:

### File Existence
- [ ] `docs/features/[feature-name]-plan.md` exists
- [ ] `docs/features/[feature-name]-schedule.md` exists
- [ ] `docs/features/[feature-name]-team-checklist.md` exists

### plan.md Content
- [ ] All 8 required sections present in correct order
- [ ] Executive Summary has: timeline, team size, risk summary
- [ ] Task Sequence Map shows dependency flow
- [ ] All tasks have: Phase, Component, Depends On, Timeline, Acceptance Criteria
- [ ] All effort estimates converted to calendar dates
- [ ] Resource assignments completed (or explicitly "TBD")
- [ ] Risk & Mitigation populated with 1-10 risks

### schedule.md Content
- [ ] Phase breakdown with start/end dates for all 7 phases
- [ ] Milestones defined with target dates
- [ ] Critical path identified
- [ ] Resource allocation timeline present
- [ ] Contingency buffer calculated (10-20% of total)
- [ ] Sprint/weekly breakdown if applicable

### team-checklist.md Content
- [ ] All tasks listed with owners and due dates
- [ ] Dependencies documented
- [ ] Phase gates defined
- [ ] Sign-off structure in place

### Data Consistency
- [ ] All task dates align between plan.md and schedule.md
- [ ] All task names/IDs consistent across all three files
- [ ] All task owners assigned in team-checklist.md match assignments in plan.md
- [ ] No circular task dependencies
- [ ] All milestone dates match between files

---

## Key Format Requirements

### Task Date Format
**Required**: ISO 8601 format (YYYY-MM-DD)
```
- Start: 2026-02-24
- End: 2026-02-26
```

### Duration Format
**Required**: Number of days as integer
```
Duration: 2 days
Duration: 5 days
```

### Owner Format
**Required**: Person name or Role
```
Assigned To: Alice Johnson
Assigned To: Backend Team Lead
Assigned To: TBD (hiring in progress)
```

### Severity Levels
**Required**: Only these values
```
Severity: Critical
Severity: High
Severity: Medium
Severity: Low
```

### Status Values
**Required**: Only these values (for tracking updates)
```
Status: Not Started
Status: In Progress
Status: Blocked
Status: Complete
Status: Failed
```

---

## Distinguishing This Contract from feature-breakdown Format

**Do NOT confuse these:**

### feature-breakdown outputs:
- Contains: Task effort estimates (Small/Medium/Large) - ABSTRACT
- Contains: Component architecture and dependencies
- Contains: Acceptance criteria and validation plan
- Does NOT contain: Calendar dates
- Does NOT contain: Resource assignments
- File: `breakdown.md` (singular)

### feature-planning outputs (this contract):
- Contains: Calendar dates and milestones - CONCRETE
- Contains: Phase-by-phase timeline
- Contains: Resource assignments
- Contains: Critical path analysis
- Files: `plan.md`, `schedule.md`, `team-checklist.md` (THREE files)

**Red Flag**: If trying to use this contract to validate breakdown.md, you have the wrong file!

---

## Validation Script

```python
def validate_execution_plan_format(feature_name):
    """Validate that execution plan files meet format contract"""
    
    import os
    from datetime import datetime
    
    base_path = f"docs/features/{feature_name}"
    
    required_files = [
        f"{base_path}-plan.md",
        f"{base_path}-schedule.md",
        f"{base_path}-team-checklist.md"
    ]
    
    # 1. Check all files exist
    for file_path in required_files:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Missing required file: {file_path}")
    
    # 2. Check plan.md sections
    with open(f"{base_path}-plan.md", 'r') as f:
        plan_content = f.read()
    
    required_sections = [
        "Executive Summary",
        "Task Sequence Map",
        "Detailed Task List",
        "Timeline & Milestones",
        "Resource Plan",
        "Risk & Mitigation",
        "Verification & Sign-Off",
        "Next Steps"
    ]
    
    for section in required_sections:
        if f"## {section}" not in plan_content:
            raise ValueError(f"Missing section in plan.md: {section}")
    
    # 3. Check for date format (YYYY-MM-DD)
    import re
    dates = re.findall(r'\d{4}-\d{2}-\d{2}', plan_content)
    if len(dates) < 5:
        raise ValueError("Insufficient dates in plan.md (need at least 5)")
    
    # Validate date format
    for date_str in dates:
        try:
            datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            raise ValueError(f"Invalid date format: {date_str}")
    
    # 4. Check schedule.md content
    with open(f"{base_path}-schedule.md", 'r') as f:
        schedule_content = f.read()
    
    if "Phase" not in schedule_content:
        raise ValueError("schedule.md missing phase information")
    
    if "Critical Path" not in schedule_content:
        raise ValueError("schedule.md missing critical path")
    
    # 5. Check team-checklist.md content
    with open(f"{base_path}-team-checklist.md", 'r') as f:
        checklist_content = f.read()
    
    if "- [" not in checklist_content:
        raise ValueError("team-checklist.md missing checklist items")
    
    print("✅ Execution plan format validated successfully")
    return True
```

---

## Breaking Changes Policy

If either skill needs to change the format:

1. **feature-planning changes output**: Update this contract FIRST, then update execution-tracking
2. **execution-tracking needs different input**: Update this contract FIRST, then feature-planning
3. **Major version change**: Update version in both SKILL.md files
4. **Minor addition**: Document new optional fields clearly

### Version History

| Date | Change | Breaking | Skills Updated |
|------|--------|----------|-----------------|
| 2026-02-19 | Initial contract definition | No | Both |

---

## Common Questions

**Q: What if plan.md is missing one of the 8 sections?**
A: execution-tracking cannot proceed. Regenerate plan.md using feature-planning skill with complete inputs.

**Q: Can I use execution-tracking without schedule.md?**
A: No. All three files are required. The contract specifies THREE file requirement.

**Q: What if task dates conflict between plan.md and schedule.md?**
A: This is a format violation. Both files must agree on all dates. Regenerate execution plan.

**Q: Can I update the plan while tracking execution?**
A: Yes. execution-tracking generates updated schedule files. original `schedule.md` becomes `schedule-updated.md`.

**Q: How do I know if I should use feature-planning or execution-tracking?**

| Situation | Skill |
|-----------|-------|
| Don't have plan.md yet | feature-planning |
| Team hasn't started building | feature-planning |
| Team is actively building, monitoring progress | execution-tracking |
| Need to create initial timeline | feature-planning |
| Need to track actual progress vs plan | execution-tracking |
| Asking "When will this be done?" (before building) | feature-planning |
| Asking "How are we tracking to completion?" (during building) | execution-tracking |

---

## Examples

### Valid Plan.md Structure
```markdown
# Feature Plan: User Authentication

## Executive Summary
Timeline: Feb 24 - Mar 6 (2 weeks)
Team: 3 developers
Risks: 2 identified (both mitigated)

## Task Sequence Map
[Dependency diagram]

## Detailed Task List
### Task 1-1: Database Schema
- Start: 2026-02-24
- Duration: 1 day
- End: 2026-02-24
- Assigned To: Alice

### Task 2-1: API Implementation
- Start: 2026-02-25
- Duration: 3 days
- End: 2026-02-27
- Depends On: Task 1-1
- Assigned To: Bob
```

This passes validation ✅

### Invalid: Missing Dates
```markdown
# Feature Plan: User Authentication

## Executive Summary
Timeline: "a couple weeks" (NO DATES!)
Team: 3 developers

## Detailed Task List
### Task 1-1: Database Schema
- Duration: 1 day (NO START/END DATES!)
```

This fails validation ❌

### Invalid: Missing Files
```
docs/features/user-auth-plan.md exists
docs/features/user-auth-schedule.md exists
docs/features/user-auth-team-checklist.md missing ❌
```

This fails validation ❌
