# Blocker Log Template

Use this template to track blockers throughout your feature implementation. This log helps identify patterns, track resolution, and prevent future blockers.

## Setup

Create a file at: `docs/features/[feature-name]-blockers.md`

Update this file whenever a blocker is encountered and as blockers are resolved.

---

## Blocker Log Template

```markdown
# Blocker Log: [Feature Name]

**Project**: [Feature name]
**Duration**: [Start date] - [Current date]
**Total Blockers**: [N] (open: [N], resolved: [N])
**Critical Blockers**: [N] (unresolved: [N])
**Average Resolution Time**: [N] hours

---

## Open Blockers (Active)

### Blocker #1: [Clear, specific title]

**Severity**: 🔴 Critical / 🟡 High / 🟠 Medium / 🟢 Low

**Tasks Affected**: 
- [Task ID]: [Task name] (blocked since [date])
- [Task ID]: [Task name] (blocked since [date])

**Impact**: 
- Timeline impact: [N] days delay if unresolved
- Team impact: [N] developers blocked
- Priority: [Critical for release / High / Medium / Low]

**Description**: 
[Clear description of what's blocking progress]

**Root Cause**: 
[Why is this happening? What's the underlying issue?]

**Owner**: [Name, Role]

**Unblocking Strategy**: 
[What needs to happen to unblock?]
- Step 1: [Action]
- Step 2: [Action]
- Step 3: [Action]

**Dependencies**: 
[What does this depend on?]
- On Team X delivering Y by date Z
- On external service availability
- On stakeholder decision

**Workaround** (if available):
[Can team work around this? How?]

**Expected Unblock Date**: [Date, with rationale]

**Status**: 
- First reported: [Date]
- Last updated: [Date]
- Duration: [Days since report]
- Escalation level: [Internal team / Management / Stakeholder]

**Notes**: 
[Any additional context]

---

### Blocker #2: [Clear, specific title]

[Repeat structure above]

---

## Resolved Blockers (Recent)

### Blocker #[N]: [Title]

**Severity**: 🔴 Critical / 🟡 High / 🟠 Medium / 🟢 Low

**Status**: ✅ Resolved

**Tasks Affected**: [Which tasks were blocked]

**Root Cause**: [What caused it]

**Resolution**:
[How was it resolved?]

**Unblock Date**: [When was it resolved]

**Resolution Duration**: [How long from report to resolution]

**Owner**: [Who unblocked it]

**Lessons Learned**: 
[How can we prevent this next time?]
- Action 1: [What to do differently]
- Action 2: [What to do differently]

**Assigned for Follow-Up**: 
- [Action owner]: [Action to prevent recurrence]

---

## Blocker Patterns & Trends

### By Severity

| Severity | Total | Avg Resolution | Still Open | Pattern |
|----------|-------|-----------------|-----------|---------|
| Critical | [N] | [N] hours | [N] | [Pattern] |
| High | [N] | [N] hours | [N] | [Pattern] |
| Medium | [N] | [N] hours | [N] | [Pattern] |
| Low | [N] | [N] hours | [N] | [Pattern] |

### By Category

| Category | Examples | Prevention |
|----------|----------|-----------|
| External Dependencies | [Service X delays, Team Y blocking] | [What to do differently?] |
| Technical Complexity | [Unknown framework, Architecture issue] | [What to do differently?] |
| Resource Constraints | [Person sick, Context switching] | [What to do differently?] |
| Unclear Requirements | [Ambiguous spec, Missing info] | [What to do differently?] |
| Integration Issues | [API changes, Data format incompatibility] | [What to do differently?] |
| Other | [Specify] | [What to do differently?] |

### Analysis

**Most Common Blocker Type**: [Category]

**Longest Resolution Time**: [Blocker name] ([N] hours)

**Quickest Resolution**: [Blocker name] ([N] hours)

**Blocker Frequency**: [N] blockers per week (trending [up/stable/down])

**Impact**: 
- Total team days lost to blockers: [N] days
- Percentage of timeline affected: [N]%
- Critical path impact: [Yes/No]

---

## Prevention Strategies

Based on blockers encountered, here's how to prevent similar issues in future features:

### External Dependencies
**Prevention**:
- [ ] Start external integrations earlier
- [ ] Establish clear SLAs with external teams
- [ ] Create fallback/mock services early
- [ ] Communicate timeline dependencies upfront

**Owner**: [Role]

### Technical Complexity
**Prevention**:
- [ ] Do architecture spike/POC upfront
- [ ] Involve senior engineer earlier
- [ ] Add buffer time for complex tasks
- [ ] Research unfamiliar technologies during planning phase

**Owner**: [Role]

### Resource Constraints
**Prevention**:
- [ ] Plan for team capacity variations
- [ ] Cross-train team to avoid single-person dependencies
- [ ] Have backup person assigned for critical skills
- [ ] Monitor team workload for context switching

**Owner**: [Role]

### Unclear Requirements
**Prevention**:
- [ ] Invest more time in requirements gathering upfront
- [ ] Create detailed specification before planning
- [ ] Get stakeholder sign-off on requirements
- [ ] Add requirement clarification as early task in breakdown

**Owner**: [Role]

### Integration Issues
**Prevention**:
- [ ] Plan integration points earlier
- [ ] Create integration tests early
- [ ] Establish clear API contracts
- [ ] Test with real data/services, not just mocks

**Owner**: [Role]

---

## Blocker Review Schedule

### Weekly Review

- Every [Day] at [Time]
- Review: All open blockers
- Update: Status and expected resolution
- Escalate: Any blockers unresolved >3 days
- Celebrate: Recent resolutions

### Phase Gate Review

- At end of each phase
- Review: All blockers from this phase
- Analyze: Patterns and prevention
- Document: Lessons learned
- Update: Prevention strategies for next phase

### Project Retrospective

- At end of project
- Comprehensive blocker analysis
- Root cause analysis across all blockers
- Prevention strategies for next similar feature
- Team discussion: What could we do differently?

---

## Escalation Path

### Immediate Escalation (Critical Blockers)

**If blocker is:**
- Blocking critical path and will delay project
- Unresolved >1 hour and urgent
- Requires decision authority
- External and needs stakeholder intervention

**Escalate to**: [Manager / PM / Executive]

**Format**: [Phone call / Slack alert / Email]

**Information needed**:
- What's blocked
- Impact if unresolved
- What decision/action needed
- Timeline for response needed

### Standard Escalation (High Priority)

**If blocker is:**
- High priority but not immediately critical
- Unresolved >4 hours
- Requires resource or priority change
- Cross-team issue

**Escalate to**: [Team Lead / Project Manager]

**Format**: [Daily standup / Email update]

**Information needed**:
- Description and root cause
- What needs to unblock
- Proposed solution

### Monitoring (Medium/Low Priority)

**If blocker is:**
- Medium priority
- Has workaround available
- Owner is actively working on resolution
- Not blocking critical path

**Escalate to**: Team backlog

**Format**: [Weekly review]

**Action**: Monitor and update weekly

---

## Communication Templates

### Daily Stand-Up Blocker Report

"We have [N] blockers today:
- [Critical blocker]: [Impact], resolution expected [date]
- [High blocker]: [Impact], team working on it
- [Resolution]: [Blocker resolved from yesterday]"

### Weekly Blocker Email

Subject: Blocker Report - [Feature] - [Date]

"**Summary**:
- Open blockers: [N] (Critical: [N], High: [N])
- Resolved this week: [N]
- Average resolution time: [N] hours

**Current Critical Issues**:
[List with impact and resolution strategy]

**For Discussion**:
[What needs decision/help from leadership?]"

### Escalation Alert

Subject: URGENT - Blocker Escalation - [Feature]

"**CRITICAL BLOCKER**
- Issue: [Description]
- Impact: [Timeline/team impact]
- Action needed: [Specific action]
- Decision/approval needed by: [Time]"

---

## Templates for Specific Scenarios

### External Service Dependency Blocker

```
Blocker #X: [Service] API not available

Severity: Critical

Description: Integration with [Service] API is down/slow, blocking Task 2-1

Root Cause: [Service] maintenance / [Service] service degradation / API change

Workaround: Use local mock API until service restored

Owner: Dev X to monitor, PM to coordinate with [Service] team

Expected Unblock: [When service expected to be restored]

Impact: If unresolved >4 hours, 2 developers blocked, critical path delayed

Escalation: Contact [Service] support, consider temporary mock deployment
```

### Resource Unavailability Blocker

```
Blocker #X: [Person] unavailable, blocking Task 1-2

Severity: High

Description: [Person] who has specialized knowledge of [technology] is unavailable, blocking progress on Task 1-2

Root Cause: [Person] needed for [reason], not available until [date]

Workaround: Pair [Backup person] with documentation to get up to speed

Owner: PM to find backup resource

Expected Unblock: [Date when person available or backup trained]

Impact: If unresolved >1 day, 1-2 developers idle

Prevention: Cross-train on [technology], have backup person assigned early
```

### Cross-Team Dependency Blocker

```
Blocker #X: Team Y has not delivered dependency for Task 1-3

Severity: High (becoming critical in 2 days)

Description: Cannot start Task 1-3 until Team Y delivers [Deliverable]

Root Cause: Team Y delayed on their work

Expected Delivery (per their commit): [Date]

Current Status (from Team Y): [Status]

Workaround: Create mock version to unblock testing

Owner: PM to coordinate with Team Y PM

Escalation: If still not delivered by [date], escalate to management

Impact: If unresolved >2 days, critical path delayed

Prevention: Establish clearer SLAs, start coordination earlier, build in buffer
```

### Technical Complexity Blocker

```
Blocker #X: Architecture decision needed for Task 2-1

Severity: High (becoming critical in 1 day)

Description: Cannot proceed with API design until architecture decision is made on [Decision]

Root Cause: [Decision] was not finalized during planning

Options:
1. [Option A] - [Pros/cons]
2. [Option B] - [Pros/cons]

Owner: Tech Lead to make decision

Expected Unblock: [When decision will be made]

Impact: 2 developers waiting, blocks critical path

Prevention: Make architecture decisions during planning phase, involve senior engineer
```

---

## Metrics Dashboard

### Blocker Statistics (Overall)

- Total blockers: [N]
- Still open: [N]
- Resolved: [N]
- Success rate (resolved): [N]%
- Average resolution time: [N] hours

### Blocker Velocity

| Week | New Blockers | Resolved | Open |
|------|-------------|----------|------|
| Feb 19 | 2 | 0 | 2 |
| Feb 26 | 3 | 1 | 4 |
| Mar 5 | 1 | 3 | 2 |

**Trend**: [Increasing / Stable / Decreasing]

**Interpretation**: [What does this mean for project health?]
```

---

## Review Questions

Use these questions during blocker reviews:

### Weekly Review
1. How many new blockers this week?
2. Are we resolving blockers faster than creating them?
3. What's the longest-unresolved blocker?
4. Are any blockers becoming systemic (repeated issues)?
5. What do we need to unblock next?

### Pattern Analysis
1. What's the most common blocker type?
2. Are certain team members causing blockers?
3. Are certain components causing blockers?
4. Could early action have prevented these blockers?
5. What's the most impactful blocker type?

### Prevention Planning
1. How can we prevent [blocker type] next time?
2. Who owns prevention strategy?
3. When will prevention strategy be implemented?
4. Should prevention be built into next feature planning?
5. What resources are needed for prevention?
