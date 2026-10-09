## Design Critique: Shafik Adam portfolio (v3, commit `6f05f35`)

**Context:** a single-page personal portfolio for a cloud/backend software engineer, aimed at recruiters and hiring managers. **Stage:** refinement (third iteration).
**Method:** Design plugin `design-critique` framework, applied to screenshots of both themes at 390px and 1280px plus a hover/animation pass.

### Overall Impression
The concept is memorable and specific to Shafik: a building whose floors are the sections, lit at night and dark by day, ties directly to his building-management work. The biggest opportunity is the recruiter's fast path. Contact details and proof of work sit at the very bottom, and on phones the building pushes all content about two screens down.

### Usability
| Finding | Severity | Recommendation |
|---------|----------|----------------|
| No way to contact Shafik or see his profiles from the first screen; email, GitHub and LinkedIn only appear in the last section | 🔴 Critical | Add a compact row of email, GitHub and LinkedIn links under the status pill in the hero |
| No downloadable resume; recruiters often want a PDF to forward | 🟡 Moderate | Add a "Download resume (PDF)" link once Shafik provides the file (don't generate one) |
| Phones: the building is ~420px tall under the hero text, so About starts roughly two screens down | 🟡 Moderate | On phones, shrink the building to ~160px wide and sit it beside or behind the name, or drop the floor labels so it's shorter |
| Floor and file names (`about.ttl`, `projects/`) are developer jokes; a non-technical recruiter may hesitate | 🟢 Minor | Fine as personality since every section heading is plain English; keep the plain headings prominent |
| The status pill (rounded border) looks like a button but does nothing | 🟢 Minor | Drop the border or make it plain text with the dot |
| Phone "Files" menu doesn't close on Escape or on tapping outside | 🟢 Minor | Close on Escape and outside tap |

### Visual Hierarchy
- **What draws the eye first:** at night, the 60 lit amber windows outshine the name; by day, the name leads. The building as first read is acceptable (it's the signature), but the name and role should win on a recruiter's first glance.
- **Reading flow:** name → role → status pill → building on desktop works left to right. On phones the flow stalls at the building.
- **Emphasis:** the to-scale "3 days vs under 5 minutes" bars and the request log are the strongest proof points but sit mid-paragraph in long bullet lists. Each role reads as a wall of text.

### Consistency
| Element | Issue | Recommendation |
|---------|-------|----------------|
| Corner radius | Six values in use (4, 6, 8, 18, 999px, plus square floor badges) | Settle on two: 6px for cards and panels, full round for pills |
| Amber accent | Means "lit / progress" in the building and timeline, but also colours org names, skill labels and request labels | Reserve amber for light and progress; use the text colour or a muted blue for labels |
| Section spacing | 120px top and bottom padding at desktop leaves large empty bands (e.g. after About) | Reduce to ~80px at desktop |
| Stat panels | The two stat panels match each other ✅, but the PomoZoo card and riddle card use a different radius and border colour | Share one panel style |

### Accessibility
- **Color contrast:** body and muted text pass in both themes. Fails: floor tags beside the building (1.9:1 night, 2.3:1 day), day-mode code comments (3.85:1), day-mode focus ring (1.67:1). See the accessibility review.
- **Touch targets:** theme toggle (34px), Files, GitHub and LinkedIn (33px tall) are under 44px on phones.
- **Text readability:** body at 17px with 1.6 line height and ~68ch lines is comfortable. Monospace labels at 11px are small but legible.

### What Works Well
- The building concept is unique, tied to Shafik's real work, and doubles as navigation.
- Day/night themes feel like one design, not two; the window cascade on toggle is a satisfying, meaningful transition.
- Stats are honest and drawn to scale; the 0.1% sliver makes "3 days → under 5 minutes" land instantly.
- Motion is restrained: animations answer clicks and scrolling, and `prefers-reduced-motion` is respected throughout.
- Personality in the fun-facts floor (panda riddle, cats) makes the site memorable without getting in the way.

### Priority Recommendations
1. **Recruiter fast path in the hero:** email, GitHub and LinkedIn links on the first screen, and a resume PDF when available. Recruiters decide in seconds; contact shouldn't need a full scroll.
2. **Shorter phone hero:** shrink or reposition the building on phones so About is reachable in one swipe. Most first visits from a recruiter's message happen on a phone.
3. **Fix the accessibility issues:** building floor links, day-mode focus, and the three contrast fails. These are small token and markup changes with high impact.
