# Verification and self-review · 2026-10-30

## Completed locally

- Reconciled 937 package identities and 707 provider identities from the immutable Marketplace source commit `746786d7f2200c394671103879781f29348019e6` plus seven historical legacy exports.
- SHA-256 verification of all five current source files passes.
- All 707 identified providers have SBA search and website-screening attempts; 87 SEC entity mappings were reviewed/retained. These are screening attempts, not 707 conclusive legal findings.
- Ten meaningful data/classification tests pass: provider deduplication and cohort-first evidence, unknown denominators, active/NAICS-aware registry rules, historical program intervals, financial filing dates/overlap, evidence conflicts, source integrity, coverage, certification event choice, and rolling-window boundaries.
- `npm run check`: zero Svelte errors and warnings.
- Svelte MCP autofixer on the main page and layout components: no issues or suggestions. Markdown methodology was validated through the Svelte/mdsvex production compiler.
- `npm run build`: static prerender succeeds for both pages.
- `scripts/check-site.mjs`: both pages, 46 local page/asset/download links, and equality of canonical and published JSON pass on the final local artifact.
- Separate self-review caught and corrected cohort deduplication retaining the last rather than earliest record, two conflicting company/registry cases, an mdsvex head compilation issue, and a local-link check that initially missed relative links.
- The original FedRAMP lab reference integrity was checked before work; its source tree was not edited. Final reference verification also passes: 63,442 unchanged entries.

## Limitations and remaining evidence gaps

- Browser control was disabled in Work settings. No screenshot-based visual review, interactive browser filter test, mobile-device test, keyboard audit, or automated browser accessibility audit has been completed. Responsive CSS, semantic labels, focus styles, reduced-motion handling, and compiler checks are implemented; those are not substitutes for browser QA.
- Historical size coverage is sparse. Current records are not backdated. No causal policy-effect estimate is claimed.
- Parent ownership and exact procurement NAICS are not exhaustively established for every provider. Documented-small means a public representation in the selected context, not a verified legal determination.
- 107 historical package identities remain unresolved, including ten currently listed; government-operated services are excluded from commercial rates.
- Full-population USAspending bulk downloads failed twice. A one-company diagnostic succeeded but yielded no incorporated classification evidence. Status/request records are retained.
- Dependency audit reports six low-severity development-tool findings, with no high-severity findings after updating Vite to 6.4.5. The deployed site is static. Vite also reports a >500 kB client chunk because the evidence table ships the full compact dataset; the compressed payload is substantially smaller, but mobile performance remains unmeasured.

## Deployment

Deployment outcome and final verification are appended after GitHub Actions and public HTTP checks complete.
