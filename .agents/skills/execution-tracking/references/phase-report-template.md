# Phase Report Template

Use this template to create comprehensive reports at the end of each project phase. Phase reports provide closure on completed work, identify lessons learned, and prepare for the next phase.

## Setup

Create a file at: `docs/features/[feature-name]-phase-[N]-report.md`

For example:
- `docs/features/user-auth-phase-1-report.md` for Foundation phase
- `docs/features/user-auth-phase-2-report.md` for Backend phase

Create a phase report at the end of each phase.

---

## Phase Report Template

```markdown
# Phase [N] Report: [Phase Name]

**Feature**: [Feature name]
**Phase**: [Phase number and name] (e.g., Phase 2: Core Backend)
**Report Date**: [Date]
**Report Author**: [Name, Role]
**Reviewed By**: [PM / Tech Lead]

---

## Executive Summary

**Phase Status**: ✅ Complete / 🟡 Partial / ❌ Incomplete

**What was completed**:
- [Task 1-1: Brief description]
- [Task 1-2: Brief description]
- [N additional tasks]

**What was carried over**:
- [Task 1-3: Why? Expected completion date]
- [Total: N tasks, reason for carryover]

**Quality Summary**: 
- Test coverage: [N]%
- Code review status: [Quality feedback summary]
- Critical issues: [N] (all resolved? escalated?)
- Performance: [Any regressions? Improvements?]

**Key Achievement**: [What's the most important accomplishment this phase?]

**Key Lesson**: [Most important learning from this phase]

---

## Phase Overview

**Planned Duration**: [Start date] - [End date] ([N] days)

**Actual Duration**: [Start date] - [End date] ([N] days)

**Variance**: [+N days late / -N days early]

**Tasks Planned**: [N]

**Tasks Completed**: [N] ([N]%)

**Tasks Carried Over**: [N] ([N]% of planned)

**Blockers Encountered**: [N]

**Critical Issues**: [N] (all resolved?)

---

## Detailed Task Completion

### Completed Tasks

| Task ID | Task Name | Owner | Planned End | Actual End | Status | Notes |
|---------|-----------|-------|------------|-----------|--------|-------|
| 1-1 | Database Schema | Dev1 | Feb 21 | Feb 21 | ✅ | On time |
| 1-2 | API Setup | Dev1 | Feb 22 | Feb 23 | ✅ | 1 day late |
| 1-3 | Auth Integration | Dev2 | Feb 23 | Feb 23 | ✅ | On time |

**Total Completed**: [N] tasks in [N] days
**Average Task Duration**: [N] days (planned: [N] days)

### Incomplete/Carried Over Tasks

| Task ID | Task Name | Owner | Planned End | Status | Reason | New Target | Impact |
|---------|-----------|-------|------------|--------|--------|-----------|---------|
| 1-4 | Admin Panel | Dev3 | Feb 24 | 🟡 50% | External blocker | Mar 1 | Blocks testing phase start |

**Total Carried Over**: [N] tasks

**Impact of Carryover**:
- Timeline impact: [N] days
- Blocks next phase: [Yes/No]
- Must complete before: [Next phase / Release]
- Risk level: [Low / Medium / High]

---

## Quality Metrics

### Testing

**Unit Tests**:
- Coverage: [N]%
- Pass rate: [N]%
- Issues found: [N]
- All critical issues resolved: [Yes/No]

**Integration Tests**:
- Pass rate: [N]%
- Issues found: [N]
- All critical issues resolved: [Yes/No]

**E2E Tests** (if applicable):
- Pass rate: [N]%
- Issues found: [N]
- All critical issues resolved: [Yes/No]

**Manual Testing**:
- Scenarios tested: [N]
- Issues found: [N] (severity breakdown)
- All critical issues resolved: [Yes/No]

### Code Quality

**Code Review**:
- Changes reviewed: [N] pull requests
- Average review time: [N] days
- Common feedback patterns: [Pattern 1, Pattern 2]
- Quality issues: [N] ([Common issues])
- Approval rate: [N]%

**Code Standards**:
- Linting violations: [N] (resolved: [N])
- Type checking: [Passing/Issues] ([Description if issues])
- Architecture compliance: [Yes/No] ([Issues if any])

### Performance

**Benchmarking** (if applicable):
- [Metric 1]: [Planned: X] → [Actual: Y]
- [Metric 2]: [Planned: X] → [Actual: Y]
- Regressions: [None / Description]

### Security (if applicable)

- Security review completed: [Yes/No]
- Issues found: [N]
- Critical issues: [N] (all resolved?)
- Compliance checks: [Passed/Failed]

---

## Team Performance

### Velocity & Capacity

**Planned Velocity**: [N] task-days/day

**Actual Velocity**: [N] task-days/day

**Variance**: [N]% [ahead/behind]

**Team Capacity**:
- Planned hours: [N] developer-days
- Actual hours spent: [N] developer-days
- Utilization: [N]%
- Context switches: [N] (impact: [minor/moderate/major])

### Team Composition

| Developer | Role | Tasks Assigned | Tasks Completed | Notes |
|-----------|------|-----------------|-----------------|-------|
| Dev1 | Backend | [N] | [N] | [Performance notes] |
| Dev2 | Backend | [N] | [N] | [Performance notes] |
| Dev3 | Frontend | [N] | [N] | [Performance notes] |

**Skill Gaps Identified**: 
- [Skill 1]: [Who needs training? Impact?]
- [Skill 2]: [Who needs training? Impact?]

**Standout Performance**: 
- [Developer]: [What went well?]

**Areas for Support**: 
- [Developer]: [What type of support needed?]

---

## Blockers & Issues

### Critical Blockers Encountered

#### Blocker 1: [Title]

**Description**: [What was blocking?]

**Impact**: [How many days? Which tasks affected?]

**Root Cause**: [Why did it happen?]

**Resolution**: [How was it resolved?]

**Duration**: [Days from report to resolution]

**Prevention for Next Phase**: [What will we do differently?]

### High Priority Issues

[List any high priority issues and resolutions]

### Issue Patterns

**Most Common Issue Type**: [Issue type]
**Most Time-Consuming Issue**: [Issue type]
**Preventable Issues**: [N] (vs. external/unavoidable: [N])

---

## Decisions & Changes

### Major Decisions Made This Phase

1. **Decision: [Title]**
   - Context: [Why was this decision needed?]
   - Options considered: [Options and tradeoffs]
   - Decision: [What was chosen and why?]
   - Impact: [How does this affect the project?]
   - Owner: [Who made the decision?]
   - Approved by: [Stakeholder approval?]

2. [Additional decisions]

### Scope Changes

- **Scope Added**: [Any new work? Why? Impact?]
- **Scope Removed**: [Any removed work? Why? Impact?]
- **Net Change**: [Overall scope impact]

### Technical Changes

- **Architecture Adjustments**: [Any changes to architecture? Why?]
- **Technology Changes**: [Any technology changes? Why?]
- **Process Changes**: [Any process improvements implemented?]

---

## Lessons Learned

### What Went Well ✅

1. **[Positive 1]**: [Description]
   - Impact: [How did this help?]
   - Replicate: [Should we do this again?]

2. **[Positive 2]**: [Description]
   - Impact: [How did this help?]
   - Replicate: [Should we do this again?]

3. [Additional positives]

### What Could Be Better 🔄

1. **[Challenge 1]**: [What was difficult?]
   - Impact: [How much did this affect us?]
   - Root Cause: [Why did it happen?]
   - Next Time: [What will we do differently?]

2. **[Challenge 2]**: [What was difficult?]
   - Impact: [How much did this affect us?]
   - Root Cause: [Why did it happen?]
   - Next Time: [What will we do differently?]

3. [Additional challenges]

### Surprising Discoveries 🔍

- [Discovery 1]: [What did we learn that we didn't expect?]
- [Discovery 2]: [What did we learn that we didn't expect?]

### Recommendations for Next Phase

1. **[Recommendation 1]**: [What should we do differently?]
   - Responsible: [Who should own this?]
   - Timeline: [When should we implement?]
   - Expected Impact: [How will this help?]

2. [Additional recommendations]

---

## Preparation for Next Phase

### Phase Gate Review

**Gate Criteria**:
- [ ] All critical tasks completed
- [ ] Quality gates met (test coverage, code review, performance)
- [ ] Documentation complete
- [ ] No blocking issues for next phase
- [ ] Team ready to proceed

**Gate Status**: ✅ Passed / 🟡 Conditional / ❌ Not Ready

**Conditions (if conditional)**:
- [Condition 1]: [What needs to happen before next phase?]
- [Condition 2]: [When will this be resolved?]

### Dependencies for Next Phase

**Incoming Dependencies** (from external teams/systems):
- [Dependency 1]: [From Team X, due date Y]
- [Dependency 2]: [From Team X, due date Y]
- Ready: [Yes / No]

**Outgoing Deliverables** (needed by next phase):
- [Deliverable 1]: [What are we providing? When?]
- [Deliverable 2]: [What are we providing? When?]
- Ready: [Yes / No]

### Resource Planning for Next Phase

**Team Composition**:
- Continuing: [Dev1, Dev2, Dev3]
- Added: [Dev4 joining for {reason}]
- Departing: [Dev5 leaving for {reason}]

**Known Absences**:
- [Dev X]: [Vacation/leave dates]
- [Dev Y]: [Training dates]
- Buffer: [N] days

**Capacity**:
- Expected capacity: [N] developer-days
- Key dependencies: [Any single-point dependencies?]

### Next Phase Priorities

**Must Complete**:
- [Task from carryover 1]
- [Task from carryover 2]

**Should Complete**:
- [Task 2-1]
- [Task 2-2]

**Could Complete**:
- [Task 2-N (if ahead of schedule)]

**Not In Next Phase**:
- [Task deferred to phase N+1]

---

## Risk Review & Updates

### Risks That Materialized

| Risk | Predicted? | Severity | Mitigation Effectiveness | Owner |
|------|-----------|----------|------------------------|-------|
| [Risk 1] | [Yes/No] | [Actual impact] | [Did mitigation work?] | [Owner] |

### New Risks Identified

| New Risk | Probability | Impact | Mitigation | Owner |
|----------|-------------|--------|-----------|-------|
| [Risk 1] | [High/Medium/Low] | [High/Medium/Low] | [Mitigation strategy] | [Owner] |

### Risk Adjustments for Next Phase

- [Risk 1]: Update probability/impact based on actual experience
- [Risk 2]: New mitigation strategy based on lessons learned

---

## Timeline Analysis

### Phase Timeline Performance

```
Planned:  |=========| [Planned end date]
Actual:   |===========| [Actual end date]
          [Variance indicator]
```

**Analysis**:
- Started: [On time / [N] days early / [N] days late]
- Ended: [On time / [N] days early / [N] days late]
- Total variance: [+N days late / -N days early]
- Primary cause: [What caused the variance?]

### Velocity Trending

| Week | Velocity | Trend | Notes |
|------|----------|-------|-------|
| Week 1 | [N] | [↑/↔/↓] | [Notes] |
| Week 2 | [N] | [↑/↔/↓] | [Notes] |
| Week 3 | [N] | [↑/↔/↓] | [Notes] |

**Trend**: [Accelerating / Stable / Decelerating]

**Overall Assessment**: [How did velocity compare to plan?]

### Updated Project Timeline

**Previous Projection**: [Date]

**Updated Projection**: [Date] (variance: [+N days / -N days])

**Confidence**: [High / Medium / Low]

**Factors Affecting Confidence**:
- [Factor 1]: [Impact]
- [Factor 2]: [Impact]

---

## Sign-Off & Approval

### Phase Completion Verification

- [ ] All planned tasks completed or properly carried over
- [ ] Quality gates met (testing, code review, performance)
- [ ] Documentation complete
- [ ] Blockers resolved or escalated
- [ ] Lessons learned documented
- [ ] Next phase ready to start

### Stakeholder Approvals

| Role | Name | Approval | Date | Notes |
|------|------|----------|------|-------|
| Tech Lead | [Name] | ✅ Approved / 🟡 Conditional / ❌ Rejected | [Date] | [Notes] |
| Project Manager | [Name] | ✅ Approved / 🟡 Conditional / ❌ Rejected | [Date] | [Notes] |
| Product Owner | [Name] | ✅ Approved / 🟡 Conditional | [Date] | [Notes] |

### Reported By

- **Author**: [Name, Role]
- **Date**: [Date]
- **Review Completed**: [Date]

---

## Appendix: Detailed Metrics

### Complete Task List with Metrics

[Include full task list with all metrics for reference]

### Code Metrics

[Include detailed code metrics: complexity, duplication, coverage, etc.]

### Performance Metrics

[Include performance benchmarks and comparisons]

### Team Feedback

[Include anonymous team feedback on phase experience]
```

---

## Usage Instructions

### When to Create Phase Reports

Create a phase report at the end of each project phase:
- Phase 0: Foundation/Setup
- Phase 1: Data/Schema
- Phase 2: Core Backend
- Phase 3: Integration
- Phase 4: Frontend
- Phase 5: Testing
- Phase 6: Documentation
- Phase 7: Release

### Timing

Create the report:
1. **During phase end day**: Compile metrics and task status
2. **Day after phase end**: Write lessons learned and analysis
3. **Two days after phase end**: Review and stakeholder approval
4. **Three days after phase end**: Archive and reference for next phase

### Who Should Write It

- **Primary**: Tech lead or project manager who oversaw the phase
- **Input**: Developers and QA from the phase
- **Review**: PM, Tech Lead, Product Owner
- **Approval**: Project Manager and Product Owner

### Distribution

After approval:
1. Share with team (celebrate wins, share learnings)
2. Share with stakeholders (project status)
3. Archive in project documentation (historical record)
4. Reference for retrospective at project end

---

## Key Questions to Answer

When completing a phase report, ensure you answer:

1. **What were we trying to accomplish?** (Phase goal)
2. **What did we actually accomplish?** (Tasks completed)
3. **How well did we execute?** (Quality metrics, velocity)
4. **What didn't we accomplish?** (Carryover, why?)
5. **What got in our way?** (Blockers, challenges)
6. **How do we do better next time?** (Lessons learned)
7. **Are we ready to proceed?** (Gate review)
8. **What does the next phase depend on?** (Dependencies, handoff)

---

## Common Report Patterns

### Successful Phase

✅ All planned tasks complete
✅ Quality gates met
✅ On schedule or early
✅ Low blocker count
⚠️ Some lessons learned (normal)

### At-Risk Phase

🟡 Most tasks complete, some carried over
🟡 Quality concerns addressed
🟡 Running 1-2 days behind
🟡 Moderate blocker count
🟡 Lessons learned about prevention

### Troubled Phase

❌ Significant tasks incomplete
❌ Quality concerns not fully addressed
❌ Running 3+ days behind
❌ High blocker count
❌ Multiple systemic issues

**Required Actions**:
- [ ] Root cause analysis of issues
- [ ] Corrective action plan for next phase
- [ ] Stakeholder decision on timeline/scope adjustments
- [ ] Additional support/resources for next phase
