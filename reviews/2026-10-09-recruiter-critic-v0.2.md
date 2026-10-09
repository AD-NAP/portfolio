# Recruiter critique: v0.2.0 (2026-10-09)

Run by the `recruiter-critic` subagent on branch `claude/v0.2-isometric`, before the merge to `main`. It reviewed the screenshots in `.review/`, `index.html` and `content/resume.md`.

**Verdict:** Interview for a junior/associate backend role; Maybe for mid-level, since the page shows about 9 months full-time plus a 6-month internship.
**Role I'd consider him for:** Junior backend/cloud engineer (AWS serverless, Python, TypeScript). AI engineering: not yet on this evidence.

**Merge blockers: none.** v0.2 did not bury the proof, and nothing a recruiter needs is behind the riddle (B1 holds only the cake and two lines).

## 30-second impression

- What I understood: name, role, stack, current employer, both proof points and Email/GitHub, all on the first screen at 390 and 1280, in both themes. The isometric building is memorable and costs no space on the phone.
- What I had to hunt for: seniority (first date is on phone screen 3), and the 3 days to under 5 minutes chart (phone screen 5, under the internship).

## Evidence that lands

- Hero proof line: "~3 days to under 5 minutes" and "approved by Azbil Japan leadership". Intact and bold.
- Event Log bullet: AppSync, cursor pagination over DynamoDB, ULID ordering, Clean Architecture layers. Real backend depth.
- "owned the Event Log and assisted with other small features and bug fixes": honest scoping, which builds trust.
- "Converted to full-time from the internship below."
- edge-energy-optimizer: time-based split, baseline comparison, stated "Known limits". Public repo link.

## Concerns (most important first)

| # | Sev | Concern | Where | Why it matters | Suggested fix |
|---|-----|---------|-------|----------------|---------------|
| 1 | Medium | "AI engineering roles" has thin backing: one classical ML project, phase 1 of 5 | Contact, Projects | I would screen him out for AI roles and may doubt his focus | Lead with backend, or ask Shafik for more AI evidence |
| 2 | Medium | About repeats the hero, then the Turtle card and Skills push Experience to phone screen 3 | About, Skills | Slows the skim before any evidence | Shorten About, or move Skills below Experience |
| 3 | Low | Typed riddle adds a keyboard step on phones between Education and Contact | Fun facts (L2) | Harmless because the hero already has contact links; skippable | Keep. Confirm a wrong guess gives clear feedback |
| 4 | Low | "Personal project, Oct 2026": resume.md only records phase 1 done 2026-10-04, no start date | Projects meta | Only loosely supported claim on the page | Confirm, or say "phase 1 done Oct 2026" |
| 5 | Low | The "R" floor label looks struck through by a roof line | Hero building, 1280 dark | Small polish flaw on the first screen | Nudge the label |
| 6 | Low | React is listed with no evidence on the page (the reason React Native was trimmed) | Skills | Invites an interview question | Ask Shafik |

All other claims match `content/resume.md`, including the v0.1.1 fixes and "0.1% of the first".

## Questions for Shafik

- Do you have any LLM or AI engineering work to show, at work or personal?
- Where have you used React?
- When did edge-energy-optimizer start?
- Do you have a LinkedIn URL or a resume PDF to link?
- What filled 2018 to 2021 (for example National Service)? Recruiters will ask.

## Not verified by the critic

It reviewed screenshots and `index.html` only. It did not test the mouse lean, wrong-guess feedback, or keyboard behaviour of the riddle.

## Claude's spot-checks and triage

- #3: wrong-guess feedback is covered by the checker's riddle test (a hint appears and B1 stays shut).
- #4: fixed before the merge. The project line now reads "Personal project, in progress. Phase 1 done Oct 2026".
- #5: checked against the day theme, where the "R" is clean. The mark is a star behind the label at night, not a roof line. Logged as a small polish item.
- #1, #2, #6 and the questions: in `BACKLOG.md`.
