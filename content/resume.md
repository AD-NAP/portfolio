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

### Ground Labs, Singapore: Software Developer Intern (Aug 2019 to Nov 2019)

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
- Status: phase 1 done on 2026-10-04. Phase 2 is next. Phases 3 to 5 are not scheduled yet. (`projects/edge-energy-optimizer.md`, `ideas/edge-energy-optimizer-plan.md`)
- Phase 1 result: day-ahead load forecast, MAE 34.5 kWh on the 2017 test year against 45.7 kWh for the "same hour last week" baseline, so 24.5% better. (`projects/edge-energy-optimizer.md`, `dev-log/04-10-2026.md`)
- Data: real meter data from the Building Data Genome Project 2, one office building (`Hog_office_Shawnna`). (`dev-log/04-10-2026.md`)
- Pipeline built: dataset, naive baselines, features, time-based split, gradient boosted trees, evaluation, error analysis, and a `forecast()` function with tests. (`dev-log/04-10-2026.md`)
- Model: `HistGradientBoostingRegressor` from scikit-learn, default settings, 100 trees. (`learning/machine-learning/gradient-boosted-trees.md`)
- Features: calendar (hour, day of week, day of year, is holiday), weather (air temperature, dew point), lags (load 24 hours and 168 hours before). (`learning/machine-learning/features-and-target.md`)
- Split: train on 8 Jan to 31 Dec 2016 (8,616 rows), test on all of 2017 (8,760 rows); split by time, never shuffled. (`learning/machine-learning/train-test-split.md`)
- Known limits: the model guesses high (bias +13.8 kWh) because the building used about 8% less in 2017 than in 2016; holidays are the weak spot (MAE 61.9 kWh against 32.6 on weekdays). (`dev-log/04-10-2026.md`, `learning/machine-learning/error-analysis.md`)
- Tooling: uv for the Python environment. (`dev-log/04-10-2026.md`)

### Considered and not used

- rag-agent-service: planned, not started, repo not created yet. Nothing to show. (`projects/rag-agent-service.md`)
- 30-days-of-python, neetcode-150: practice repos, nothing solved yet. (`projects/30-days-of-python.md`, `projects/neetcode-150.md`)

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
