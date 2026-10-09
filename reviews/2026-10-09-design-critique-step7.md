<!-- Step 7 run, 2026-10-09, branch claude/step7-recruiter-critique.
     The Design plugin's `design-critique` skill was not available in this session, so Claude wrote this
     in the same format as reviews/2026-10-09-design-critique.md, from the four contact sheets in .review/
     and the checker's report.json. Treat it as a self-review, not an independent one. -->

## Design Critique: Shafik Adam portfolio (step 7 branch)

**Context:** single-page portfolio for a cloud/backend software engineer, aimed at recruiters and hiring managers. **Stage:** refinement after the recruiter critique.
**Method:** contact sheets of both themes at 390px and 1280px, compared with the same sheets from `main`.

### Overall Impression
The first screen now carries a result, not only a stack. The Experience visuals are rebalanced: the time-saved chart is the only boxed graphic there, and the test fixture is a thin bar. The page is shorter (desktop 9 screens to 8; phone stays at 9 with a longer project card).

### Usability
| Finding | Severity | Recommendation |
|---------|----------|----------------|
| "Code on GitHub" leads to a GitHub 404 while the repo is private | 🔴 Critical (before sharing) | Shafik makes `AD-NAP/edge-energy-optimizer` public; verify 200 logged out |
| No resume PDF and no LinkedIn | 🟡 Moderate | Waiting on Shafik for both |
| Sidebar entry `edge-energy-optimizer.md` wraps to two lines at 1280px | 🟢 Minor | Accept, or narrow the mono font width for nested entries |
| Phones: status pill still wraps to two lines | 🟢 Minor | Already in the backlog |

### Visual Hierarchy
- **First read:** name, role, then the proof line with its two bold facts. On phones the About heading still starts on the first screen (844px tall).
- **Experience:** the Event Log bullet now leads the current role. "< 5 min" is the largest value in its chart and the only amber one.
- **Charts:** the empty track is close to invisible (1.08:1 night, 1.12:1 day against the card), so a bar reads as full or not at a glance. Full bar vs track: 7.36:1 night, 4.93:1 day (was 1.47 and 1.77).
- **Day mode:** the amber model bar is 1.65:1 against the track. Hue separates them clearly, but it is the weakest pair on the page.

### Consistency
| Element | Issue | Recommendation |
|---------|-------|----------------|
| Charts | Both charts share one component and the `--track` token ✅ | None |
| Amber | Used for results (chart values, model bar) and still for org names and skill labels | Older backlog item stands: reserve amber for light and progress |
| Corner radius | Still 4, 6, 8, 18 and round | Older backlog item stands |
| Section spacing | Desktop padding 120px to 80px; Fun facts and Contact tightened ✅ | None |

### What works
- The proof line uses resume wording only ("Helped build", not "shipped").
- The project card states its limits and that four of five phases are not built.
- Nothing new moves on its own; the only animation touched is the request bar, which is now smaller and shorter.

### Priority Recommendations
1. Make the project repo public before the site is shared.
2. Decide on a resume PDF and LinkedIn URL.
3. Day mode: consider a slightly deeper track or accent so the model bar has more than 1.65:1 against the track.
