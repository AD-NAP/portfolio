<!-- First run of the recruiter-critic subagent (.claude/agents/recruiter-critic.md), 2026-10-09, site at commit 424e6f2.
     The agent was not yet registered in this session (subagents load at session start), so it ran as a
     general-purpose subagent given the same instructions and told to stay read-only.
     Main session verified: LinkedIn points to the home page (2 links); empty vs full bar contrast in the
     time-saved chart is 1.47:1 night / 1.77:1 day, so concern #5 holds. -->

## Recruiter critique: Shafik Adam portfolio

**Verdict:** Interview. The work at Azbil shows real backend skill (AppSync + DynamoDB cursor pagination, Clean Architecture layering, an MVP approved by HQ, and a 3-days-to-5-minutes automation win), but the strongest proof sits too far down the page.
**Role I'd consider him for:** Junior to early mid-level backend/cloud engineer (AWS serverless, Python/TypeScript). He has about 10 months full-time plus a 7-month internship, so I would interview him for mid-level but probably level him junior+.

### 30-second impression
- What I understood: Phone screen #1 answers who and where right away. He is "Shafik Adam", a software engineer working with Python, TypeScript and AWS, currently at Azbil in Singapore, and Email/GitHub/LinkedIn sit right under his name. The desktop hero (#1) is just as clear, and the building graphic is memorable without getting in the way. Both themes read cleanly.
- What I had to hunt for: Any impact. Nothing above the fold says what he has *achieved*. "3 days → under 5 minutes" is on phone screen #5 and desktop #5, under the *intern* role. The "MVP approved by Azbil Japan leadership" line is in the middle of the fourth bullet. I also had to work out his seniority myself from the dates. On top of that, the hero LinkedIn link goes to linkedin.com's home page, which looks broken.

### Evidence that lands
- **Experience, Azbil engineer, bullet 2:** "designed a GraphQL `eventLogs` query on AWS AppSync with cursor-based pagination over DynamoDB (ULID-ordered, configurable page size)… following Clean Architecture." This is exactly the depth I look for in a backend hire, and it's specific enough to be credible.
- **Experience, Azbil intern:** "reducing preparation time from approximately 3 days of manual engineering work to under 5 minutes", backed by a drawn-to-scale bar chart. It's a concrete, honest impact metric.
- **Experience, Azbil engineer, bullet 4:** "Cloud BMS MVP over 9 months in a 3-developer team… approved by Azbil Japan leadership for continued development toward commercial release." It shows ownership in a small team and a business outcome.
- **Ownership language:** "Delivered… end to end" and "owning UI/UX, workflow design, and implementation across a 5-month cycle".
- **Contact:** the email is large and obvious on both phone and desktop, and contact links appear in the hero as well as at the bottom.

### Concerns (most important first)
| # | Concern | Where | Why it matters to a hiring manager | Suggested fix |
|---|---------|-------|------------------------------------|---------------|
| 1 | The best results are buried. The hero and About repeat the generic resume summary ("experience building internal tooling and cloud applications"). | Hero, About (`.lede`) | I decide in 30 seconds. Right now the first screen tells me his stack, not his results, and the 3-days→5-min win is about five screens down. | Add one line of proof to the hero or About using existing facts, e.g. "Cut config prep from ~3 days to under 5 minutes; helped ship a Cloud BMS MVP approved by Azbil Japan leadership." |
| 2 | LinkedIn links to `https://www.linkedin.com/` (hero and Contact). | Hero links, Contact | Recruiters click LinkedIn first. A generic home page looks careless or broken. | Use his real profile URL, or hide the link until he has one. |
| 3 | Visible "PLACEHOLDER: screenshot or link for PomoZoo? Send one if you have it." | Projects (phone #7, desktop #6) | It reads as unfinished, and the page should not be sent out in this state. | Remove it before sharing, or replace it with a real link or screenshot. |
| 4 | The largest graphic on the page shows a **test fixture**: "330 mocked records, fetched 100 per request". | Experience, Azbil engineer, bullet 3 | It gives more space to an MSW mock than to the production results. A sharp reader may see "330 records" as small scale. | Shrink or drop the request-log chart, and put that visual weight on the 3-days→5-min chart or the MVP outcome. |
| 5 | In the time-saved chart, the empty "With the tool" track is almost the same colour as the "By hand" bar, so at a glance both bars look full. | Experience, Azbil intern (desktop #5) | The main metric is easy to misread, and the 0.1% sliver is barely visible. | Make the empty track much fainter (or remove it) so only the filled bar reads as data. |
| 6 | The GitHub link (`ad-nap`) is the only code evidence, and Projects holds one 2021 student app. | Projects | For a backend role I'd want to see code or a recent side project. Nothing here shows that the GitHub profile has relevant work. | Ask Shafik whether he has public repos worth pinning or linking (see questions). |
| 7 | Fun facts and Contact take up a lot of mostly empty screen space. | Phone #8–9, desktop #7–9 | This is minor, but it makes the page feel longer than the evidence is. The personality is fine and memorable. | Tighten the vertical spacing in the last sections. |

### Top 3 changes before sending this to a recruiter
1. Replace the LinkedIn home-page link with his real profile (or remove it), and take out the visible PomoZoo PLACEHOLDER.
2. Put one line of evidence near the top using facts already on the resume: "~3 days → under 5 minutes" and "MVP approved by Azbil Japan leadership for continued development toward commercial release".
3. Rebalance the Experience visuals. Make the time-saved chart easy to read at a glance (fainter empty track), and shrink the 330-mock-records log so a test fixture doesn't outshine production work.

### Questions for Shafik
- What is your LinkedIn profile URL?
- Do you have public repos (on `ad-nap` or elsewhere) you'd want a hiring manager to see, especially anything backend/AWS? Is there a PomoZoo repo, store link or screenshot?
- Is there any production result for the Event Log feature or Cloud BMS you can share (e.g. it shipped to customers or a pilot, how many buildings or users, query latency)? Only if it's real and shareable.
- How many times has the intern-era config tool been used, or how many engineer-days has it saved so far?
- Did the onboarding guide have a measurable effect (e.g. how long new-joiner setup took before and after)? The site currently says "reducing ramp-up time" with no number.
