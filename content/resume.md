# Resume: source of truth for site content

Copied verbatim from Shafik's handoff (2026-10-09). The site may only state facts that appear here or that Shafik gives directly. Phone number intentionally omitted.

**Mohamad Shafik bin Mohamad Adam** (display name on the site: Shafik Adam)
Singapore · shafik.adam98@gmail.com

**Summary:** Software engineer with experience building internal tooling and cloud applications across Python, TypeScript, and AWS. NUS Computer Science graduate currently developing building-management platforms and semantic-metadata tooling at Azbil.

## Technical skills

- Languages: Python, SQL, JavaScript, TypeScript
- Frontend: Streamlit, Svelte, React, React Native, HTML/CSS
- Cloud & Infrastructure: AWS (Lambda, AppSync, DynamoDB, S3, CloudFront, CloudWatch), Docker, GitHub Actions
- Data & APIs: DynamoDB, GraphQL, SPARQL, Firebase, RDF/Brick Schema
- Practices & Tools: Git, Clean Architecture, pytest, MSW, GitHub Copilot
- Familiar: Java

## Experience

### Azbil ASPO, Singapore: Systems and Application Engineer, Software Development (Jan 2026 to present)

- Designed and built an internal Streamlit application that generates Brick Schema building-metadata files from BMS point lists, owning UI/UX, workflow design, and implementation across a 5-month cycle; completes the metadata pipeline feeding downstream configuration tooling, with planned integration into Cloud BMS deployments.
- Delivered the Event Log feature end to end for Cloud BMS, a cloud-native building management platform: designed a GraphQL eventLogs query on AWS AppSync with cursor-based pagination over DynamoDB (ULID-ordered, configurable page size), structured across adapter, application, and infrastructure layers following Clean Architecture.
- Built the corresponding Svelte frontend with an expandable table view and infinite scroll, batching 100 records per request to handle large datasets; wrote MSW mocks simulating 330 records and network latency to verify pagination and loading states.
- Contributed to the Cloud BMS MVP over 9 months in a 3-developer team using AWS Lambda, AppSync, DynamoDB, S3, CloudFront, and CloudWatch; MVP approved by Azbil Japan leadership for continued development toward commercial release.
- Authored a developer onboarding guide for Cloud BMS environment setup (Docker, AWS configuration), reducing ramp-up time for new team members.

### Azbil ASPO, Singapore: Software Engineer Intern (Jun 2025 to Dec 2025)

- Built a Python tool that parses Brick Schema TTL building-metadata files and runs SPARQL queries to auto-generate customer product configuration files, reducing preparation time from approximately 3 days of manual engineering work to under 5 minutes.

### Ground Labs, Singapore: Software Developer Intern (May 2022 to Aug 2022)

- Developed frontend features for a desktop data-discovery product, including a four-pane resizable window layout and match highlighting within search results.

## Projects

### PomoZoo: Pomodoro productivity mobile app (React Native, Firebase), May 2021 to Aug 2021

- Co-developed a cross-platform focus timer in a 2-person team for NUS Orbital, handling notification delivery reliably across app states including foreground, backgrounded, force-closed, and device powered off.

## From AD-NAP/vault

Copied from Shafik's private notes repo `AD-NAP/vault` on 2026-10-09 (approved source for projects). Each fact names its source file. PomoZoo above is no longer shown on the site.

### edge-energy-optimizer (personal project, in progress)

- Goal: forecast building load, control a simulated building, shave peak demand with a battery, and deploy it all at the edge. (`projects/edge-energy-optimizer.md`)
- GitHub repo `AD-NAP/edge-energy-optimizer` (public since 2026-10-09), description "Building load forecasting, control, and peak shaving at the edge". (GitHub repo metadata; local path from `projects/edge-energy-optimizer.md`)
- Five planned phases: 1. energy load forecasting (ML); 2. control logic tested against a simulated building (BOPTEST); 3. BACnet and Modbus protocol integration; 4. peak demand shaving with a simulated battery; 5. edge deployment on k3s with MQTT and a dashboard. Everything is simulated, so it needs no hardware. (`ideas/edge-energy-optimizer-plan.md`)
- Status (2026-10-09, superseded below): phase 1 done on 2026-10-04. Phase 2 is next. Phases 3 to 5 are not scheduled yet. (`projects/edge-energy-optimizer.md`, `ideas/edge-energy-optimizer-plan.md`)
- Phase 1 result: day-ahead load forecast, MAE 34.5 kWh on the 2017 test year against 45.7 kWh for the "same hour last week" baseline, so 24.5% better. (`projects/edge-energy-optimizer.md`, `dev-log/04-10-2026.md`)
- Data: real meter data from the Building Data Genome Project 2, one office building (`Hog_office_Shawnna`). (`dev-log/04-10-2026.md`)
- Pipeline built: dataset, naive baselines, features, time-based split, gradient boosted trees, evaluation, error analysis, and a `forecast()` function with tests. (`dev-log/04-10-2026.md`)
- Model: `HistGradientBoostingRegressor` from scikit-learn, default settings, 100 trees. (`learning/machine-learning/gradient-boosted-trees.md`)
- Features: calendar (hour, day of week, day of year, is holiday), weather (air temperature, dew point), lags (load 24 hours and 168 hours before). (`learning/machine-learning/features-and-target.md`)
- Split: train on 8 Jan to 31 Dec 2016 (8,616 rows), test on all of 2017 (8,760 rows); split by time, never shuffled. (`learning/machine-learning/train-test-split.md`)
- Known limits: the model guesses high (bias +13.8 kWh) because the building used about 8% less in 2017 than in 2016; holidays are the weak spot (MAE 61.9 kWh against 32.6 on weekdays). (`dev-log/04-10-2026.md`, `learning/machine-learning/error-analysis.md`)
- Tooling: uv for the Python environment. (`dev-log/04-10-2026.md`)

Phase 2 facts copied on 2026-11-16 from the public repo `AD-NAP/edge-energy-optimizer` (`README.md`, `docs/results/phase2.md`, `docs/decisions/0004-mpc-controller.md`, commit `5b55b2b`):

- Status: phases 1 and 2 complete; phases 3 to 5 parked, with no plans to pick them up for now. Phase 2 finished 16 November 2026. (`README.md`, `docs/results/phase2.md`)
- Phase 2 setup: controls a simulated heat pump family home in the BOPTEST simulator (test case `bestest_hydronic_heat_pump`, v0.9.0), run locally in Docker. Baseline is a thermostat fixed at 21.2 °C. (`README.md`, `docs/results/phase2.md`)
- Look-ahead heuristic ("predictive controller"): cut heating cost 10% to 16% against the fixed thermostat in all four scenarios, with comfort no worse. (`docs/results/phase2.md`)
- Model predictive controller: a four-parameter thermal model fitted from a system identification experiment (random heat pump signal), plus a 24-hour linear program (SciPy HiGHS) re-solved every hour. On two unseen two-week test periods it cut cost 14% to 20% against the thermostat and 3% to 8% against the heuristic, with similar comfort. (`docs/results/phase2.md`, `docs/decisions/0004-mpc-controller.md`)
- Stack added in phase 2: SciPy, BOPTEST, Docker. (`pyproject.toml`, `README.md`)

Story facts copied on 2026-11-24 for the engineering stories (v1.5.0), from the same repo at commit `5b55b2b` (local copy now in the workspace archive):

- Goal: reduce a building's energy cost, mainly its peak demand, without hurting occupant comfort, using a system that runs at the edge next to the equipment. (`docs/architecture.md`)
- Architecture: one loop that repeats: measure, forecast, decide, act. Controllers implement `setpoint_c(observation, forecast) -> float` in °C and know nothing about BOPTEST; the experiment runner translates to and from the BOPTEST API, so phase 3 can put BACnet underneath them unchanged. (`docs/architecture.md`, `docs/decisions/0003-control-strategy.md`)
- Constraint: every forecast feature must be known 24 hours before the hour being predicted. Measured weather stands in for weather forecasts, so reported errors are optimistic. One training year gives few holiday examples. (`docs/decisions/0002-forecasting-data-and-model.md`)
- Decision: a look-ahead heuristic first, re-decided every hour from a 24-hour forecast: follow the lower comfort bound, preheat 4 hours before occupancy, add 1 °C when the price is in the cheapest quarter of the forecast. Not MPC at first: MPC needs a thermal model and an optimizer; the heuristic needs neither. (`docs/decisions/0003-control-strategy.md`)
- Decision: the MPC's four-number thermal model is fitted with least squares from an identification experiment that drives the heat pump with a random signal. A model fitted on the thermostat runs was worse than assuming the temperature stays put, because the thermostat raised power exactly when the room cooled. (`docs/decisions/0004-mpc-controller.md`)
- Decision: MPC solves a 24-hour linear program every hour with SciPy's HiGHS. Two unseen two-week test periods were added for all controllers, because the heuristic's settings were tuned on the scenarios it is reported on and the first MPC fix was made after seeing them. (`docs/decisions/0003-control-strategy.md`, `docs/decisions/0004-mpc-controller.md`)
- What went wrong: the first MPC always asked for the temperature it planned. On sunny days the room ran warmer than the model expected, the setpoint followed it upward, and the heat pump kept heating an empty room at 28 to 30 °C (48 Kh of discomfort in the typical period). Asking for the comfort floor whenever the plan says off fixed it. (`docs/decisions/0004-mpc-controller.md`)

## From the cumulus-coach repo and vault

Copied on 2026-10-31. Sources: the public repo `AD-NAP/cumulus-coach` (`README.md`, commit `e611980`), vault `projects/cumulus-coach.md` and vault `career/resume-master.md` (updated 29-10-2026).

### cumulus-coach (personal project, in progress)

- An agentic AWS study coach: answers questions from public AWS documentation with citations, calls a tool to look up an AWS service by name when the excerpts are not enough, and says so instead of guessing when the documents don't cover a question. (`README.md`)
- Public repo: https://github.com/AD-NAP/cumulus-coach. Started 2026-10-20. (vault `projects/cumulus-coach.md`)
- RAG: 10 public AWS doc pages, chunked (500 words, 50 overlap), embedded locally and stored in Chroma. The top 3 chunks go to Claude as numbered excerpts, and every claim cites one, such as [2]. (`README.md`)
- Two refusal layers: a distance cutoff in code refuses far-off questions without calling the API, so they cost nothing; the system prompt refuses anything the excerpts don't support. (`README.md`)
- Cutoff 1.1, picked from measured best distances on 18 questions: on-topic 0.528 to 1.042, near-topic 0.794 to 1.342, off-topic 1.736 to 2.062. Smaller is closer. (vault `projects/cumulus-coach.md`, 26-10-2026)
- Structured output: every answer is an `Answer` with `text`, `refused` and `citations`. (`README.md`)
- Tool-using agent: `ToolAgent` runs a Claude tool-use loop with a `lookup_service` tool, capped at 5 rounds; tool results continue the excerpt numbering so they can be cited. `RagAgent` is the baseline behind the same `Agent` interface. (`README.md`)
- Tests and CI: 18 pytest tests run on every push with GitHub Actions; Claude and Chroma are replaced with fakes, so tests are free and need no API key. (`README.md`)
- Stack: Python, the Claude API (Haiku 5.5 for development), Chroma with local embeddings, pytest, GitHub Actions. (`README.md`)
- Status: minimum demo complete on 29-10-2026. Next: an eval set of about 20 questions comparing `RagAgent` and `ToolAgent`. (vault `projects/cumulus-coach.md`, `README.md`)
- Master CV wording: summary adds "and LLM applications with RAG and function calling"; skills row "AI and LLM: Claude API (function calling, structured outputs), RAG, embeddings, Chroma vector store, Claude Code, GitHub Copilot". (vault `career/resume-master.md`)

Story facts copied on 2026-11-24 for the engineering stories (v1.5.0). Sources: repo `docs/ADR.md` and `docs/ARCHITECTURE.md` (commit `e611980`), vault `projects/cumulus-coach.md` (25-10-2026 notes):

- Decision 0001: Chroma as a local, file-based vector store with its default local embedding model. No extra API key or cost for embeddings; runs the same on a laptop, in Docker and in CI. Trade-off: a small local model retrieves less well than a large hosted one; the eval set will show whether that matters. (`docs/ADR.md`)
- Decision 0002: every agent implements `Agent.run(question) -> Answer`; retrieval and tools are plain functions any agent can call, so the eval compares backends fairly on the same questions, retrieval and tools. (`docs/ADR.md`)
- Constraint: the Claude API is pay-as-you-go, with $5 prepaid credits, auto-reload off and a spend limit; Haiku 5.5 for development. (vault `projects/cumulus-coach.md`, 25-10-2026)
- Constraint: the demo must be cheap, run on a laptop and in CI, and be easy for someone else to clone and run. (`docs/ADR.md`, 0001 context)

### Considered and not used

- rag-agent-service: never started; the idea became cumulus-coach. (`projects/rag-agent-service.md`, `projects/cumulus-coach.md`)
- 30-days-of-python, neetcode-150: practice repos, nothing solved yet. (`projects/30-days-of-python.md`, `projects/neetcode-150.md`)

## From AD-NAP/vault: the fun side (2026-11-19)

Facts for the fun side's learning log (`back/`, desk). Summaries of Shafik's own notes; nothing about his job, per the vault's privacy rule.

- October 2026: day-ahead load forecast for one office building (Building Data Genome Project 2) beat "same hour last week" by 24.5% (MAE 34.5 against 45.7 kWh). Data leakage took three tries: lags count backward from the target hour, not from now. (`dev-log/04-10-2026.md`)
- October 2026: started cumulus-coach on 20-10-2026, an AWS study agent with RAG, citations, an off-topic cutoff and tool calling. (`projects/cumulus-coach.md`)
- October 2026: learned Claude Code's building blocks (CLAUDE.md, skills, hooks, subagents, plan mode) by building this portfolio; Playwright drives a real browser for the checker's screenshots and accessibility scan. (`dev-log/09-10-2026.md`, BACKLOG.md "Learning path")
- November 2026: model predictive control for edge-energy-optimizer: a thermal model fitted from a system identification experiment, a 24-hour plan re-solved every hour; 14% to 20% cheaper than the fixed thermostat on unseen periods (also above). Done 16-11-2026. (`projects/edge-energy-optimizer.md`)
- November 2026: NAP (Not Another Prototype), a Claude Code dev team (PM, Architect, Engineer, Reviewer, run by a Personal Assistant), took one brief to a working app in about 45 minutes: 7 issues, 4 PRs, all approved on the first review, CI green. Public repo: https://github.com/AD-NAP/not-another-prototype (public since 09-11-2026). (`dev-log/14-11-2026.md`, `dev-log/15-11-2026.md`, `projects/nap.md`)
- November 2026, lessons from NAP: agents in headless runs need one command per call; a test that reads the CI file as text doesn't prove CI works; a stacked PR landed on a dead branch. (`dev-log/14-11-2026.md`, `dev-log/15-11-2026.md`)
- November 2026, lessons from this site: the zine, the business card that opens into a drawing sheet, and the fun side's room; scale a background layer, never the text; search for what exists before building. (`dev-log/18-11-2026.md`, `dev-log/19-11-2026.md`)

## Education

- National University of Singapore, School of Computing: Bachelor of Computing (Computer Science), Honours (Merit), Jan 2026. Relevant coursework: Software Engineering; Data Structures and Algorithms; Design and Analysis of Algorithms; Programming Methodology I & II; Computer Organisation; Introduction to AI.
- Singapore Polytechnic: Diploma in Electrical and Electronic Engineering (Computer and Power specialisation), Apr 2015 to May 2018.

## Numbers worth highlighting

3 days → under 5 minutes; 9-month MVP in a 3-person team, approved by Azbil Japan leadership; 100 records per batch / 330 mocked records; 5-month build cycle.

## Facts Shafik added later (not on the resume)

- Loves cats and pandas.
- Favourite animal: the panda, which is what his GitHub name hides. (Shafik, 2026-10-09)
- GitHub username `ad-nap` spells "pan-da" backwards; GitHub's logo is a cat.
- Onboarding guide (Cloud BMS) effect: a new junior engineer used the guide and, with minimal guidance, set up his environment and started development on the same day. (Shafik, 2026-10-09)
- Cloud BMS MVP ownership: he owned the Event Log only, and assisted with other small features and bug fixes. (Shafik, 2026-10-09)
- NUS start year: 2021. (Shafik, 2026-10-09)
- Azbil: the move from intern to full-time was a conversion. (Shafik, 2026-10-09)
- Open to roles in backend software development and AI engineering. (Shafik, 2026-10-09)
- Site skills list: React Native and Firebase are trimmed from the site, because PomoZoo (their only evidence) is no longer shown. They stay on the resume above. (Shafik, 2026-10-09)
- `AD-NAP/edge-energy-optimizer` was made public on 2026-10-09 at Shafik's request.
- LinkedIn: https://www.linkedin.com/in/shafikadam/ (from AD-NAP/vault `todo/soon/job-switch.md`, updated 2026-10-18; Shafik, 2026-10-22)
- Downloadable resume `assets/Shafik-Adam-Resume.pdf`: his general master CV from AD-NAP/vault `career/resume-master.md` (rebuilt 2026-10-18), with the phone number removed. Rebuilt 2026-10-31 from the master CV updated 29-10-2026 (adds cumulus-coach and the GitHub link), with `npm run -s resume`. Its wording is newer than this file in places; the site text still comes only from this file. (Shafik, 2026-10-22)
- Cloud BMS: no real users yet and no shareable numbers. The MVP has approval to continue development and looks promising for certain markets. (Shafik, 2026-10-22)
- GitHub Actions: worked with the team's pipeline, which a senior set up; say "worked with", not "built". His project cumulus-coach will add CI/CD he builds himself. (Shafik, 2026-10-22)
- AI engineering work: cumulus-coach, an AWS study agent with RAG, tool calling and an eval set, in progress; nothing to show on the site until it ships (around 2026-10-30). (Shafik, 2026-10-22)
- edge-energy-optimizer started on 2026-10-04 (first commit), the same day phase 1 was done. (From AD-NAP/edge-energy-optimizer git history, 2026-10-22)
- May 2018 to 2021, between Singapore Polytechnic and NUS: full-time National Service. Not shown on the site. (Shafik, 2026-10-22)
- Ground Labs dates corrected from Aug 2019 to Nov 2019 (wrong) to May 2022 to Aug 2022, during NUS. Final interview 27 Apr 2022; NUS SIP period 11 May to 31 Jul 2022, shown as May to Aug. (Shafik, 2026-10-22)
- Keeps a dev log and learning notes for his projects in the vault: dated entries such as `dev-log/04-10-2026.md` and notes under `learning/machine-learning/`, cited as sources above. Used on the v1.0.0 cover ("I keep a dev log of what each project teaches me") and in "Notes I took", whose lessons restate facts already in this file. (2026-11-18)
- Cloud BMS is written in TypeScript: the frontend is Svelte in TypeScript, and the backend is mostly AWS CDK in TypeScript. Python is used only for the Brick Schema metadata tooling, because of the Brick Schema libraries. (Shafik, 2026-11-18)

- SQL and React: familiar, used a bit, not main skills. They stay in Skills with no proof on the page. (Shafik, 2026-11-24)
- Engineering stories (v1.5.0): Shafik approved the draft wording of both project stories in the plan on 2026-11-24.

## Facts Shafik added for the fun side (2026-11-19)

- Hobbies: reads self-help books on how people think, such as *The Art of Thinking Clearly*; plays shooter games and is "pretty good at it". (Shafik, 2026-11-19)
- Goals: the AWS Certified Cloud Practitioner certificate by the end of 2026; finish cumulus-coach by the end of 2026; edge-energy-optimizer shown as completed. (Shafik, 2026-11-19)
