# Progress Tracking Template

Use this template to organize and track daily progress for your feature implementation.

## Setup

Create a file at: `docs/features/[feature-name]-progress.md`

Update this file daily or at your chosen frequency (daily standup, end of day, end of week).

---

## Progress Tracker Template

```markdown
# Progress Tracking: [Feature Name]

**Last Updated**: [Date and time]
**Tracking Period**: [Start date] - [Target completion date]
**Current Phase**: [Phase name and number]
**Overall Status**: 🟢 On Track / 🟡 At Risk / 🔴 Off Track

---

## Executive Summary

**Progress This Period**:
- Tasks completed: [N] / [Total]
- Tasks in progress: [N]
- Blocked tasks: [N]
- Percentage complete: [N]%

**Timeline Status**:
- Planned completion: [Date]
- Current projection: [Date] (±[N] days)
- Critical path impact: [Yes/No]
- Contingency used: [N]% of [Total]%

**Blockers**:
- Critical blockers: [N]
- High priority blockers: [N]
- All blockers unresolved for >24h: [Yes/No]

---

## Task Status Details

### By Phase: [Phase Name]

| Task ID | Task Name | Owner | Status | % Complete | Planned End | Actual End | Notes |
|---------|-----------|-------|--------|-----------|-------------|-----------|-------|
| 1-1 | Database Schema | Dev1 | ✅ Complete | 100% | Feb 21 | Feb 21 | On schedule |
| 1-2 | API Setup | Dev1 | 🟡 In Progress | 60% | Feb 22 | Feb 23 | One day behind, unblocking today |
| 1-3 | Authentication | Dev2 | 🔴 Blocked | 0% | Feb 24 | TBD | Blocked on 1-2, will start tomorrow |
| 2-1 | Endpoint A | Dev1 | ⏹️ Not Started | 0% | Feb 25 | N/A | Waiting for API setup |

**Phase Status**:
- Planned phase end: [Date]
- Current projection: [Date]
- Variance: [N] days [ahead/behind]

---

## Blocker Log (This Period)

### Critical Blockers

#### Blocker 1: [Title]
- **Status**: 🔴 Open / 🟡 Being addressed / ✅ Resolved
- **Description**: [What is blocking progress?]
- **Impact**: [Which tasks are blocked? How many days lost?]
- **Owner**: [Who is working to unblock?]
- **Root Cause**: [Why did this happen?]
- **Resolution Plan**: [How will it be fixed?]
- **Expected Unblock Date**: [When will this be resolved?]
- **Resolution Date**: [If resolved: when was it unblocked?]

### High Priority Blockers

[Repeat blocker structure for each high priority blocker]

### Medium Priority Blockers

[List briefly or note "None"]

---

## Metrics

### Burndown Data

| Date | Tasks Complete | Remaining Tasks | Remaining Task-Days | Velocity |
|------|----------------|-----------------|-------------------|----------|
| Feb 19 | 0 | 21 | 45 | - |
| Feb 20 | 2 | 19 | 40 | 5 days |
| Feb 21 | 4 | 17 | 35 | 5 days |

**Burndown Analysis**:
- Planned velocity: [N] task-days/day
- Actual velocity: [N] task-days/day
- Trend: 📈 Accelerating / ➡️ Stable / 📉 Decelerating
- Days to completion at current velocity: [N]
- Days remaining in timeline: [N]
- **Status**: [On track / Will need extension / Will finish early]

### Quality Metrics (This Period)

- Unit test coverage: [N]%
- Integration tests passing: [N]%
- Code review feedback: [Average quality/severity]
- Performance regressions: [None / List any]
- Security issues found: [None / List any]

### Team Capacity

- Team size: [N] developers
- Planned hours this week: [N]
- Actual hours this week: [N]
- Utilization: [N]%
- Absences or context switches: [List any]

---

## Timeline Projections

### Current Projection

| Phase | Planned End | Actual/Projected End | Variance | On Track? |
|-------|-------------|-------------------|----------|-----------|
| Foundation | Feb 22 | Feb 21 | -1 day (early) | ✅ Yes |
| Backend | Feb 26 | Feb 28 | +2 days (late) | ❌ No |
| Frontend | Mar 2 | Mar 5 | +3 days (late) | ❌ No |
| Testing | Mar 5 | Mar 8 | +3 days (late) | ❌ No |
| Release | Mar 6 | Mar 9 | +3 days (late) | ❌ No |

**Overall**: Currently projecting [Date] - [N] day(s) [ahead of / behind] original plan

**Critical Path**: [Phase name] is currently on critical path and driving overall timeline

### Risk Assessment

| Risk | Current Status | Probability | Impact | Mitigation | Owner |
|------|----------------|-------------|--------|-----------|-------|
| Backend complexity | 🔴 Manifesting | High | High | Add Dev3 to backend tasks | PM |
| External API delays | 🟡 Monitoring | Medium | High | Create local mock API | Dev2 |
| Testing time shortage | 🟡 Preparing | Medium | Medium | Prioritize E2E tests | QA Lead |

---

## Decisions & Changes

### Changes This Period

- **Change 1**: [What changed? Why? Impact?]
  - Owner: [Who made decision]
  - Approved: [Stakeholder sign-off]
  - Impact: [How does this affect timeline]

### Decisions Needed

- **Decision 1**: [What needs to be decided? By when?]
  - Owner: [Who will decide]
  - Options: [What are the options]
  - Impact: [What's the impact of each]

---

## Next Period Priorities

### Immediate (Next 1-2 Days)

1. [Unblock X to unblock Y]
2. [Complete critical path task]
3. [Resolve blocker]

### This Week

1. [Complete phase X]
2. [Start phase Y]
3. [Achieve milestone Z]

### Risks to Monitor

- [Risk 1]
- [Risk 2]
- [Risk 3]

---

## Team Notes

### Wins 🎉

- [What went well this period?]
- [Celebrate team effort]

### Challenges 😓

- [What was harder than expected?]
- [How did team respond?]

### Feedback for Next Feature

- [What should we do differently next time?]
- [What process improvements?]

---

## Sign-Off

- **Prepared By**: [Name, Role]
- **Reviewed By**: [PM / Tech Lead name]
- **Approved By**: [Stakeholder / Project Manager]
- **Date**: [Date]
```

---

## Usage Instructions

### Daily Workflow

1. **Morning standup**: Update status from previous day
   - Mark completed tasks as "✅ Complete"
   - Update in-progress tasks with % complete
   - Document any blockers raised overnight

2. **During day**: Capture blockers as they arise
   - Add to blocker log with severity
   - Note impact immediately
   - Assign owner for unblocking

3. **End of day**: Quick summary
   - Update all task statuses
   - Calculate burndown metrics
   - Brief summary for next day

### Weekly Workflow

1. **Start of week**: Review past week
   - Analyze burndown velocity
   - Review blockers and resolutions
   - Plan priorities for this week

2. **Mid-week check**: Ensure on track
   - Verify critical path progress
   - Escalate any timeline risks
   - Adjust team allocation if needed

3. **End of week**: Generate weekly report
   - Summarize week's progress
   - Highlight blockers and resolutions
   - Communicate to stakeholders
   - Plan next week

### Phase Gate Review

At the end of each phase:

1. **Phase completion**:
   - Are all phase tasks complete?
   - Do tasks meet acceptance criteria?
   - Are quality gates met?

2. **Carryover assessment**:
   - Any incomplete tasks? Why?
   - Will they block next phase?
   - When will they be completed?

3. **Lessons learned**:
   - What went well?
   - What could be better?
   - Document for next feature

4. **Next phase readiness**:
   - Are dependencies clear?
   - Is team ready to start?
   - Any adjustments needed?

---

## Best Practices

### Frequency

- **Daily updates**: Best for fast-moving projects or high risk
- **End-of-day updates**: Good balance for most projects
- **Daily standup sync**: Quick 15-min sync, not full write-up
- **Weekly summary**: Required minimum for stakeholder communication

### Honesty and Transparency

- Report actual progress, not optimistic
- Flag risks early, don't wait hoping they resolve
- Document blockers immediately, not at end of day
- Share bad news quickly to enable response

### Metrics Focus

- Track actual vs. planned consistently
- Velocity trending is more important than individual metrics
- Focus on critical path metrics (drives timeline)
- Quality metrics prevent surprises late in project

### Communication

- Daily: Team sync
- Weekly: Stakeholder update
- Per blocker: Escalation as needed
- Phase end: Comprehensive review

---

## Examples

### Example 1: On-Track Project

```
Overall Status: 🟢 On Track
Progress: 8/21 tasks complete (38%)
Timeline: Projecting Feb 28 (planned Feb 28, 0 day variance)
Blockers: 0 critical, 0 high
Burndown: Velocity 5 task-days/day, consuming contingency as planned
```

### Example 2: At-Risk Project

```
Overall Status: 🟡 At Risk
Progress: 5/21 tasks complete (24%)
Timeline: Projecting Mar 2 (planned Feb 28, +2 day variance)
Blockers: 1 critical (unblocking today), 2 high (being addressed)
Burndown: Velocity only 3 task-days/day (planned 5), trend declining
```

### Example 3: Off-Track Project

```
Overall Status: 🔴 Off Track
Progress: 2/21 tasks complete (10%)
Timeline: Projecting Mar 8 (planned Feb 28, +8 day variance)
Blockers: 2 critical (external dependencies), 4 high (blocking critical path)
Burndown: Velocity 1.5 task-days/day (planned 5), team context-switched on other work
Decision: Scope reduction or timeline extension decision needed by EOD
```
