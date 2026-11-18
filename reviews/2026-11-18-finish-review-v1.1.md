# Impeccable finish review: v1.1.0 (Issue 2, the name card)

Run by the `impeccable-finish-reviewer` subagent on 2026-11-18. Code-led build, no comp. Disposition: fix. Kept: the card front's composition and lettering, the single hand-over, the clean cover it lands on.

## Material fixes (all applied)
1. A blank-then-ghost window in the flip, with the cover sliding up from below: card and cover are now pinned together and the grown back swaps instantly for the cover, whose title then prints in.
2. The flip had no perspective (the card squashed instead of turning): perspective moved onto the card's parent.
3. The card back read as a web page ("Resume: PDF on the cover"): row removed; labels share a baseline with values.
4. Returning visitors saw the hand-over, then a jump: the head script marks them before paint; the jump happens as soon as the trigger exists.
5. The hand-over started on an empty desk: it now rises from a visible card.
6. The phone masthead orphaned "Contact": now one row.
7. DESIGN.md described v1.0: regenerated for Issue 2.
8. The flip wrote inline styles: it now writes CSS variables only (one scrubbed value, rendered by `render(p)`).

## Ceiling ideas (not done, in BACKLOG)
- Give the card a physical edge or thickness during the turn.
- Let the card back carry the zine's title block, so the grown sheet already looks like the cover.
