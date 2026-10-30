# Marketplace SMB research

This is a standalone research project. Read README.md and docs/validation.md before changing analysis or publication. Do not use subagents.

- Preserve immutable source snapshots and hashes. No automatic live-data fetch during builds.
- Keep current size separate from size at certification. Do not backdate current representations.
- Unknown is not other-than-small. Preserve unknown denominators, identity gaps, source conflicts, and traceable evidence.
- Government/legal definitions are NAICS-, date-, purpose-, and affiliation-dependent. Do not present research classifications as official legal determinations.
- Put reviewed overrides in research/review.json; never directly edit generated data or reports.
- Keep the site simple, responsive, accessible, and free of analytics. Source Sans 3 / Source Serif 4, off-white/navy/teal editorial style.
- Use pinned Node/npm through mise and npm ci. Run analyze, test, check, build, and scripts/check-site.mjs after relevant changes.
- Browser visual/accessibility checks have not yet been completed because browser control was disabled. Do not claim they passed without actual evidence.
- Publication is GitHub Pages via Actions on main. User authorization for the initial publication is recorded in the task; do not create new unrelated remotes or services.
