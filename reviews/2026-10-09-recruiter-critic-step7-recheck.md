<!-- Step 7 run, re-run of the recruiter critic, 2026-10-09, on branch claude/step7-recruiter-critique after the
     round-2 fixes (Event Log bullet first; five-phase list collapsed to one line). Fresh general-purpose subagent
     following .claude/agents/recruiter-critic.md, read-only (the agent itself was not registered in this session).

     Compared with reviews/2026-10-09-recruiter-critic.md (first report, verdict "Interview", level junior+):
     - Fixed and no longer raised: buried results (#1), LinkedIn home-page link (#2), PomoZoo PLACEHOLDER (#3),
       unreadable time-saved chart (#5), empty space in Fun facts and Contact (#7).
     - Reduced: the 330 fixture graphic (#4) is now "keep it small as it is, or remove it".
     - Changed shape: "no recent code evidence" (#6) is now "the one code link is private" and "the project is ML,
       not backend".
     - The verdict wording moved from "Interview" to "Maybe for mid-level, Interview for junior or associate". The
       first report also said it would level him junior+, so the level is the same; the critic is now stricter
       about the mid-level seat. The remaining concerns are almost all facts only Shafik can supply
       (tenure, ownership, production numbers, resume PDF, LinkedIn), not presentation.
     Spot-checks by the main session: #2 holds (repo URL returns 404 logged out; profile returns 200).
     #5 holds. #6 matches the approved decision to shrink, not remove. -->

## Recruiter critique: Shafik Adam portfolio

**Verdict:** Maybe for the mid-level cloud/backend role, Interview for a junior or associate opening. The AWS serverless evidence is real and specific, but the site shows about 10 months of full-time experience plus a 6-month internship, and nothing about production scale, operations or testing depth on the backend.
**Role I'd consider him for:** Junior / associate software engineer on a serverless AWS team (AppSync, Lambda, DynamoDB, TypeScript, Python), especially IoT, smart-building or internal-tooling work. Stretch candidate for mid-level.

### 30-second impression
- What I understood: Name, "Software engineer building cloud applications and building-management platforms with Python, TypeScript and AWS", currently at Azbil in Singapore, and two proof points ("~3 days to under 5 minutes", "approved by Azbil Japan leadership"). All of this is on the first phone screen with Email and GitHub buttons. That is better than most portfolios I see. The file-explorer sidebar and building are memorable and did not slow me down.
- What I had to hunt for:
  - Seniority. The hero does not say it. I had to reach Experience (phone screen 3) and Education (screen 8) to work out: full-time since Jan 2026, graduated Jan 2026.
  - A resume PDF and LinkedIn. Neither exists on the page. I checked the hero, Contact and the sidebar.
  - Work authorisation and what he is looking for. Not stated anywhere.
  - On the phone, the experience evidence sits behind a full Skills list and a decorative Turtle code block (screens 2 and 3).

### Evidence that lands
- "designed a GraphQL `eventLogs` query on AWS AppSync with cursor-based pagination over DynamoDB (ULID-ordered, configurable page size)" (Experience, current role). This is the single best line for my role: it shows he understands DynamoDB access patterns, not just that he has used AWS.
- "Delivered the Event Log feature end to end" plus the Svelte frontend with infinite scroll and MSW mocks. Shows ownership across API, data and UI, and that he tests loading states deliberately.
- "reducing preparation time from approximately 3 days of manual engineering work to under 5 minutes" with the drawn-to-scale bar (Software Engineer Intern). A concrete business result, achieved as an intern, and the chart makes it stick.
- "MVP was approved by Azbil Japan leadership for continued development toward commercial release", 9 months, 3-developer team. Small team means he must have carried real weight.
- edge-energy-optimizer "Known limits: the model guesses high (bias +13.8 kWh)" and "split by time and never shuffled". Honest evaluation against a baseline is rare in portfolio projects and signals engineering maturity.

### Concerns (most important first)
| # | Concern | Where | Why it matters to a hiring manager | Suggested fix |
|---|---------|-------|------------------------------------|---------------|
| 1 | Seniority is thin for mid-level and the page does not address it. Full-time "Jan 2026 to present", intern Jun to Dec 2025, one 2019 internship. | Experience, Education | I screen on years first. Left unstated, I assume the worst and also wonder about 2019 to 2025, since no NUS start date is shown. | Make the continuous Azbil tenure obvious (Jun 2025 to present, intern then converted) in the hero status line or the role headers. Ask Shafik for the NUS start date and show it so the timeline has no visible gap. |
| 2 | The only project link may be dead for me. "Code on GitHub" points to `AD-NAP/edge-energy-optimizer`, which the resume source records as private. | Projects, "Code on GitHub" | A 404 on the one code sample is worse than no link. It also leaves me with zero readable code. | Make the repo public before sending the site out, or remove the link until it is. Confirm the hero GitHub profile shows something when opened logged out. |
| 3 | No backend depth beyond one feature: nothing on Lambda specifics, testing of the backend, CI/CD, monitoring, auth, data modelling or production usage. CloudWatch, S3, CloudFront, Docker and GitHub Actions appear only as list items. | Experience bullets 1 and 3, Skills "Cloud & infrastructure" | For a cloud/backend hire I need to know what he personally built and ran, not which services the team used. "Contributed to" is the weakest verb on the page and it sits on the strongest project. | Questions for Shafik (below) on what he owned in the MVP. Rewrite the "Contributed to the Cloud BMS MVP" bullet around his own parts once he supplies them. |
| 4 | The one project is an ML forecasting exercise, phase 1 of 5, with no cloud or backend component yet. | Projects | It shows rigour but does not support the hero claim "building cloud applications". It also reads as a pivot toward ML, which makes me unsure what role he wants. | Add one sentence saying how it connects to his day job (building energy, edge deployment is the planned phase 5 per the resume: k3s, MQTT, dashboard). Naming those planned technologies, clearly marked as planned, would tie it back to backend work. |
| 5 | Skills claim React, React Native and Firebase with no evidence on the site. The resume has PomoZoo (React Native, Firebase, notification delivery across foreground, backgrounded, force-closed and powered-off states) but the site omits it. | Skills "Frontend", "Data & APIs" | Unsupported skills make me discount the whole list. | Either bring PomoZoo back as a one-line entry (the notification-reliability detail is a decent engineering story) or drop the skills it was the only evidence for. Shafik's call. |
| 6 | Test-data visual gets a chart; production outcomes mostly do not. "330 mocked records in 4 requests: 100, 100, 100, 30" is drawn, while the MVP approval and same-day onboarding result are plain text. | Experience, current role, bullet 2 | A chart tells me "this is the important number". 330 mock records is not. It slightly undersells him. | Keep it small as it is, or remove it. Do not make it larger. |
| 7 | Skills and the Turtle block come before Experience. On a phone that is about two full screens before the first evidence. | About, Skills (phone screens 2 and 3) | Busy readers bounce before the good part. The `.ttl` block restates the paragraph above it and only means something to people who know RDF. | Consider moving Experience above Skills, or shortening the About block on phones. The Turtle block is a nice touch for a Brick Schema person; one line explaining that he works with this format daily would turn it from decoration into evidence. |
| 8 | No resume download, no LinkedIn, no statement of what he is looking for. | Hero, Contact | I need a PDF to forward to the panel and I usually cross-check LinkedIn. Without them I have to email and wait. | Add a "Resume (PDF)" link next to Email and GitHub, and LinkedIn when available. One line on target role and availability in Contact. |
| 9 | Fun facts take a full screen between Education and Contact, with a teaser about a hidden cat. | Fun facts (L5) | Harmless and likeable, and the ad-nap riddle explains the odd GitHub handle. It is just one more screen before the contact details on phone. | Fine to keep. The hero already has contact links, so the cost is low. |

What works and should not change: the hero copy, the two bolded proof points, the 3 days vs 5 minutes chart, readable type in both themes, and contact links on the first screen.

### Top 3 changes before sending this to a recruiter
1. Fix the trust basics: make sure "Code on GitHub" opens for a logged-out stranger (or remove it), and add a downloadable resume PDF beside Email and GitHub.
2. State seniority and tenure up front and close the timeline: show continuous Azbil time since Jun 2025 and the NUS start year, so I do not have to reconstruct it or guess about 2019 to 2025.
3. Replace "Contributed to the Cloud BMS MVP ... using AWS Lambda, AppSync, DynamoDB, S3, CloudFront, and CloudWatch" with what he personally built, tested and operated, using facts he supplies. This is where a mid-level case would be made or lost.

### Questions for Shafik
- Is the `AD-NAP/edge-energy-optimizer` repo public yet? Does your GitHub profile show any public repos today?
- When did you start at NUS, and what filled the time between the Ground Labs internship (2019) and the Azbil internship (2025)? National service, part-time study, other work?
- In the Cloud BMS MVP, which parts were yours besides Event Log? Any Lambda functions, DynamoDB table or key design, auth, or deployment work you can name?
- Is Cloud BMS in use by anyone yet (pilot site, internal users, number of buildings or points)? Do you have any figure for data volume or event rate the Event Log handles?
- How is the backend tested and deployed? Did you write pytest suites or GitHub Actions workflows there, or are those skills from elsewhere?
- Do you have any production monitoring or incident experience with CloudWatch (alarms, dashboards, debugging a live issue)?
- For the Streamlit Brick Schema generator: who uses it, how many people or projects, and is there a before/after time like the 3 days to 5 minutes figure?
- Do you want PomoZoo shown as evidence for React Native and Firebase, or would you rather drop those skills from the list?
- Do you have a resume PDF and a LinkedIn URL to link?
- What role are you targeting (backend, full-stack, ML/energy), and what is your work authorisation status in Singapore?
