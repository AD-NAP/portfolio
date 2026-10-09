<!-- Step 7 run, first pass of the recruiter critic, 2026-10-09, on branch claude/step7-recruiter-critique
     after the planned build (before the round-2 fixes).
     The recruiter-critic agent was not registered (the session started in Workspace/, not in this repo), so it ran
     as a general-purpose subagent given .claude/agents/recruiter-critic.md verbatim and told to stay read-only.
     Main session spot-checks:
     - #1 holds: https://github.com/AD-NAP/edge-energy-optimizer returns 404 logged out (repo is private);
       https://github.com/ad-nap returns 200. Shafik chose "link it now" and will make the repo public.
     - #5 holds: the Streamlit bullet was first. Fixed: Event Log, frontend, MVP, Streamlit, onboarding.
     - #8 acted on: the five-phase list is now one status line.
     - #6 holds (React Native and Firebase lost their evidence when PomoZoo was removed, by Shafik's decision).
     - #2: the 330 graphic was already shrunk to a 6px bar as approved; left as is. -->

## Recruiter critique: Shafik Adam portfolio

Reviewed: the four contact sheets in `.review/` (dark/light at 1280 and 390), `index.html`, and `content/resume.md`. I did not open single-screen shots, so comments on fine detail (text size, spacing) come from the sheets and the HTML only.

**Verdict:** Maybe for a mid-level seat; Interview for a junior/associate cloud-backend seat. The evidence is real, specific and on-stack (AppSync, DynamoDB, Lambda, Python, TypeScript), but the site shows about 9 months of full-time work plus internships, and nothing yet about production scale, operations or what he personally owned in the MVP.
**Role I'd consider him for:** Junior to early mid-level software engineer on an AWS serverless / backend team, especially anything touching IoT, building or industrial data.

### 30-second impression
- What I understood: Software engineer in Singapore, currently at Azbil, working in Python, TypeScript and AWS on building-management platforms. One memorable number (3 days to under 5 minutes) and one credibility line (MVP approved by Azbil Japan leadership). Email and GitHub are in the hero on both phone and desktop. This hero is better than most I see: role, proof, current job and contact all on the first screen.
- What I had to hunt for:
  - Seniority. Nothing in the hero says how long he has been working. I had to scroll to Experience and do date arithmetic (full-time since Jan 2026, intern at the same company from Jun 2025).
  - LinkedIn and a downloadable resume. Neither exists on the page.
  - Whether he is looking, and for what. The site never says he is open to roles or what kind.
  - On phone, the Experience section does not start until the third screen, after About (which repeats the hero) and a full Skills list.

### Evidence that lands
- **Hero proof line:** "Cut config preparation from ~3 days to under 5 minutes." Concrete, verifiable in interview, and repeated with a to-scale bar under the intern role. This is the thing I would remember.
- **Event Log bullet (Experience, Azbil engineer):** "designed a GraphQL `eventLogs` query on AWS AppSync with cursor-based pagination over DynamoDB (ULID-ordered, configurable page size)". This is exactly the depth a cloud/backend reviewer wants: a design decision, not a tool list.
- **End-to-end ownership:** "Delivered the Event Log feature end to end" plus the Svelte frontend and MSW mocks shows he can carry a feature across the stack and thinks about testing.
- **Onboarding guide outcome:** "A new junior engineer used it and... started development on the same day." A small but real team-impact signal, and stronger than the resume's wording.
- **Project honesty (edge-energy-optimizer):** baseline vs model, time-based split "never shuffled", and a "Known limits" bullet. Stating bias and weak spots unprompted reads as engineering maturity.

### Concerns (most important first)
| # | Concern | Where | Why it matters to a hiring manager | Suggested fix |
|---|---------|-------|------------------------------------|---------------|
| 1 | The only project link likely leads nowhere for a stranger. `content/resume.md` records the repo as private, but the site says "Code on GitHub". | Projects, `edge-energy-optimizer`, link to `github.com/AD-NAP/edge-energy-optimizer` | A 404 on the one code sample is worse than no link. I click it, get nothing, and start doubting the rest. It may also mean the GitHub profile in the hero looks empty. | Make the repo public before sending the site, or remove the link and say "Code available on request" until it is. Check what the public `ad-nap` profile shows to a logged-out visitor. |
| 2 | No production scale or operational evidence. The only numbers attached to the cloud work are test data: "330 mocked records", "100 records per request". | Experience, Azbil engineer, bullets 2 to 4, and the "330 mocked records in 4 requests" figure | For a backend role I look for real load, users, sites, latency, cost, incidents, deployments. Mock-data numbers with their own chart make the work look smaller than it probably is. | Ask Shafik for real figures (see questions). If none can be shared, drop the 330 figure's graphic and keep it as plain text so the eye goes to the AppSync/DynamoDB design instead. |
| 3 | Ownership in the MVP is vague: "Contributed to the Cloud BMS MVP over 9 months in a 3-developer team using AWS Lambda, AppSync, DynamoDB, S3, CloudFront, and CloudWatch." | Experience, Azbil engineer, bullet 4 | "Contributed to" plus a service list tells me the team's stack, not his part. In a 3-person team he likely owned a lot; the site does not say what. | Question for Shafik: which parts of the MVP were his beyond the Event Log? Rewrite with those facts only. |
| 4 | Seniority and timeline are unclear, with an unexplained stretch. Diploma ends May 2018, one internship in 2019, degree dated only "Jan 2026", then full-time from Jan 2026. | Education and Experience | I cannot tell if this is a fresh graduate or someone with prior history. Unexplained gaps cost time on a screening call, or cost the call. | Question for Shafik on the NUS start date and what filled 2018 to 2025. Also consider presenting the two Azbil entries as one continuous run (intern Jun 2025, then full-time Jan 2026), which reads as a conversion to full-time: a positive signal that is currently easy to miss. |
| 5 | The order under-sells the backend work. The first Experience bullet is the internal Streamlit app; the AppSync/DynamoDB bullet is second. On phone, About and Skills push Experience to the third screen. | Experience bullet order; section order G About, L1 Skills, L2 Experience | Skimmers read the first bullet of the first job. For a cloud/backend seat, that should be the Event Log design, not an internal UI tool. | Lead with the Event Log bullet, then the MVP, then the Streamlit tool. Consider shortening About (its paragraph and the Turtle block both restate the hero) so Experience arrives sooner on phone. |
| 6 | Several listed skills have no evidence anywhere on the page: React, React Native, Firebase, GitHub Actions, SQL. | Skills (L1) | Unsupported keywords read as padding and invite awkward interview questions. | `content/resume.md` has PomoZoo (React Native, Firebase, 2-person NUS Orbital team, notification delivery across foreground, backgrounded, force-closed and powered-off states). A one-line mention would back three of those skills with a real reliability problem. For GitHub Actions and SQL, ask Shafik where he used them, or trim. |
| 7 | No LinkedIn, no resume download, no statement of what he wants. | Hero links and Contact ("The fastest way to reach me is email.") | Recruiters in Singapore work from LinkedIn and need a PDF for the ATS. Without either, forwarding this candidate internally takes extra steps. | Add a resume PDF and LinkedIn link if Shafik supplies them. Add one line on what roles he is open to, if he is. |
| 8 | The personal project is ML forecasting, with 4 of 5 phases "planned" or "next", and takes more vertical space on phone than the production Event Log work. | Projects (L3), phases list | Good rigour, but it signals data science interest more than cloud/backend, and "planned" items are not evidence. | Keep it, but tighten: result, method, limits, link. Collapse the five-phase list to one sentence. No change to facts needed. |
| 9 | The file-explorer naming (`about.ttl`, `azbil-engineer.md`, the "Files" button on phone) and the Turtle block are clever but add no information. | Sidebar / top bar, About code block | Low cost on desktop. On phone, "Files" is not an obvious navigation label and the Turtle block spends most of a screen repeating the hero. It does tie to his Brick Schema work, which is a fair reason to keep it. | Keep the concept; consider labelling the phone button "Menu" or "Sections", and letting the Turtle block sit lower or smaller on phone. |

What works in the design: both themes are clean and legible, the building is memorable without getting in the way, and the fun facts are short enough to add personality without costing me time.

### Top 3 changes before sending this to a recruiter
1. Fix the code link: make `edge-energy-optimizer` public (and confirm the `ad-nap` profile is not empty to outsiders), or remove "Code on GitHub" until it is.
2. Reorder and sharpen the Azbil engineer entry: Event Log bullet first, replace "Contributed to" with what he actually owned, and add any real production numbers Shafik can share. Demote the 330-mocked-records graphic.
3. Close the recruiter basics: LinkedIn, a resume PDF, and a clear timeline (NUS start date, the 2018 to 2025 period, intern-to-full-time at Azbil stated plainly).

### Questions for Shafik
- Is `AD-NAP/edge-energy-optimizer` public yet? What does a logged-out visitor see on `github.com/ad-nap`?
- Do you have any real-world numbers for Cloud BMS or the Event Log: number of buildings or sites, event volume, records in the table, users, query latency, AWS cost? Which of these are you allowed to publish?
- Beyond the Event Log, which parts of the Cloud BMS MVP did you personally design or build (specific Lambdas, schema design, auth, deployment, monitoring)?
- How is Cloud BMS deployed? Did you work with infrastructure as code, CI/CD pipelines, or CloudWatch alarms and dashboards yourself? Where did you use GitHub Actions and SQL?
- Is the Brick Schema Streamlit app in use by engineers today? How many people or projects, and is there a time-saved figure like the intern tool has?
- Is the 3-days-to-5-minutes tool still in use, and by how many engineers or customer projects?
- When did you start at NUS, and what were you doing between May 2018 and Jun 2025 other than the Ground Labs internship? Is there anything from that period you want on the site?
- Was the move from intern to full-time at Azbil a conversion offer? Are you happy to say so?
- Do you want PomoZoo back as a one-line entry to support React Native and Firebase, or should those skills be trimmed?
- Can you supply a LinkedIn URL and a resume PDF?
- Are you actively looking, and for what kind of role? Do you want the site to state your work eligibility in Singapore?
