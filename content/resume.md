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

## Education

- National University of Singapore, School of Computing: Bachelor of Computing (Computer Science), Honours (Merit), Jan 2026. Relevant coursework: Software Engineering; Data Structures and Algorithms; Design and Analysis of Algorithms; Programming Methodology I & II; Computer Organisation; Introduction to AI.
- Singapore Polytechnic: Diploma in Electrical and Electronic Engineering (Computer and Power specialisation), Apr 2015 to May 2018.

## Numbers worth highlighting

3 days → under 5 minutes; 9-month MVP in a 3-person team, approved by Azbil Japan leadership; 100 records per batch / 330 mocked records; 5-month build cycle.

## Facts Shafik added later (not on the resume)

- Loves cats and pandas.
- GitHub username `ad-nap` spells "pan-da" backwards; GitHub's logo is a cat.
- Onboarding guide (Cloud BMS) effect: a new junior engineer used the guide and, with minimal guidance, set up his environment and started development on the same day. (Shafik, 2026-10-09)
