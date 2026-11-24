# Recruiter critic: v1.5.0 (projects as engineering stories)

Date: 2026-11-24. Run as a general-purpose subagent following `.claude/agents/recruiter-critic.md` (the session started in `Workspace/`, so the project agent was not loaded). Reviewed the screenshots from the first v1.5.0 check, with the stories folded and unfolded.

**Verdict:** Interview. Junior to lower-mid level, cloud/backend (AWS, TypeScript/Python); an AI/LLM-leaning backend role also fits.

## What lands
- Event Log in Experience (AppSync, cursor pagination over DynamoDB, Clean Architecture) and the to-scale "~3 days vs < 5 min" chart.
- The story format: Problem, Result and Key decisions visible is enough to decide; the fold gives depth.
- edge-energy-optimizer's "Test on unseen periods" and "Learn the house from an experiment": he tries to break his own numbers.
- cumulus-coach's two refusal layers and tests with fakes: cost-aware, testable LLM engineering.

## Concerns and what was done
| # | Concern | Outcome |
|---|---|---|
| 1 | Lessons learned now repeats the stories' Key decisions (split by time, simple option first, refuse in code) | Asked Shafik (the plan kept Lessons learned) |
| 2 | Architecture and Implementation repeat each other inside both full stories | Fixed: Architecture says how it fits together, Implementation keeps only what appears nowhere else |
| 3 | edge-energy-optimizer leads with forecast error, but its Problem is cost; the 14% to 20% cost cut is plain text | Asked Shafik (a cost chart needs the absolute cost numbers copied in first) |
| 4 | edge's Problem reads as two projects joined together | Fixed: rewritten as one loop (forecast, decide, act), phase 1 and phase 2 as its two halves |
| 5 | "What went wrong" is the best interview story and it is folded; the data-leakage story is unused | Partly fixed: the leakage story is added to What went wrong. A visible one-liner is left for Shafik |
| 6 | cumulus-coach's Result is a calibration chart, not an answer-quality result | Open: the eval results will fill it |
| 7 | edge's meta and status both say phases 1 and 2 are done; "parked" can read as abandoned | Fixed: the status now names what phases 3 to 5 are |
| 8 | Experience gets no "why" for the Event Log choices | Question for Shafik |
| 9 | Footer revision 1.4.0 | Fixed: 1.5.0 |

## Questions for Shafik
- cumulus-coach eval results, once run.
- Anything that went wrong in cumulus-coach worth a row.
- Event Log: why cursor pagination and ULID ordering, and a trade-off or bug that can be described without confidential detail.
- Is cumulus-coach deployed or runnable on AWS?
- Should NAP (the Claude Code dev team) be shown in Projects?
