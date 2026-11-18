# Recruiter critique: v1.0.0 (The build log, riso zine)

Run by the `recruiter-critic` subagent on 2026-11-18, on the first zine build (before fixes).

**Verdict:** Interview (first screen). The backend work at Azbil is real and specific, and the side projects show honest, measured engineering. Level: junior to early mid. Role: Software Engineer (backend, AWS serverless/Python); AI engineering second, once cumulus-coach has eval results.

## What lands
- Event Log: GraphQL `eventLogs` on AppSync, cursor pagination over DynamoDB, Clean Architecture layers, owned end to end.
- The config tool (about 3 days to under 5 minutes), on the cover and drawn to scale.
- cumulus-coach: two refusal layers, a cutoff picked from measurements, structured answers, 18 tests in CI with fakes.
- edge-energy-optimizer: time-based split, a beaten baseline, named limits (bias, holidays), "beat the simple option first".
- The onboarding guide outcome (a new junior started the same day).
- The design is memorable, readable in both prints, and the charts are honest. The riddle and cat cost nothing.

## Concerns and what was done
| # | Concern | Action |
|---|---|---|
| 1 | Best backend evidence sits after the projects, with no cover line | Added an Event Log cover line (p. 4). Page order kept as approved; question for Shafik in BACKLOG |
| 2 | Cover hides the current employer | Cover line now says "Software engineer at Azbil in Singapore" |
| 3 | AI claim has no eval result yet | Waiting on Shafik (cumulus-coach eval) |
| 4 | Notes I took repeats earlier pages | Cut to six notes that add new information |
| 5 | Yellow callout shows a team outcome above his own work | Callout now leads with "Owned the Event Log in a 3-developer team" |
| 6 | Zine section names slow scanning; masthead shows "The build log" not his name | Masthead now leads with "Shafik Adam". Section names kept (zine voice); question for Shafik in BACKLOG |
| 7 | TypeScript claimed but not shown | Waiting on Shafik |
| 8 | Dense experience bullets | Each bullet now starts with what was built ("Event Log API.", "Metadata generator.") |
| 9 | Empty right column in Day job; Contact hidden in phone nav | Day job rebalanced; phone contents wrap so Contact shows |

## Questions for Shafik
- cumulus-coach eval results (RAG agent vs tool agent): when will they exist?
- Was any Cloud BMS work written in TypeScript (resolvers, Lambdas, the Svelte frontend)?
- Anything shareable about the Event Log beyond test data (page size, volumes, response times)?
- Tests or infrastructure as code (CDK, SAM, CloudFormation, Terraform) for the Event Log or Cloud BMS?
- How many buildings or point lists has the Streamlit metadata generator processed, or how many engineers use it?
- How often is the config tool used (for example, customer configurations so far)?
