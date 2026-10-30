# Small business in the FedRAMP Marketplace

An independent, reproducible study of provider participation in Rev5, 20x Pilot, and non-pilot 20x. Public website: **https://pete-wai.github.io/marketplace-smb/**.

The analysis consistently uses two groups: **Documented or likely small**, and **Documented not small, likely not small, or unknown**. Individual evidence tiers remain in the audit data. It does not issue legal size determinations. Certification cohorts and rolling windows use the most recent size assessment available in the snapshot, clearly labeled as current rather than size at certification. Historical evidence remains in downloads for audit. Annual filters distinguish all-ever-certified and currently-certified populations. Unknowns remain in denominators and belong to the second reporting group. Missing registrations never imply a large business.

## Read the results

- [Interpretation and main findings](docs/reports/interpretation.md)
- [Current participation](docs/reports/participation.md)
- [Review of annual counts and non-pilot 20x](docs/reports/review-corrections.md)
- [Annual first-certification cohorts](docs/reports/annual-cohorts.md)
- [Latest versus preceding 24 months](docs/reports/recent-access.md)
- [Coverage](docs/reports/coverage.md)
- [Full methodology](src/routes/methodology/+page.svx)
- [Canonical JSON dataset](data/analysis.json)
- [Flat provider CSV](static/downloads/providers.csv), [product CSV](static/downloads/offerings.csv), and other [analysis tables](static/downloads/)
- [Self-review and verification](docs/validation.md)

Snapshot: October 30, 2026. 937 package identities and 707 resolved provider identities, including delisted history. Current and historical denominators differ; government operators are excluded from commercial rates. Source identities missing from exports remain unknown.

## Run locally

Node 24.21.0 and npm 11.19.0 are pinned in `mise.toml` and `package.json`. Install [mise](https://mise.jdx.dev/), then:

```sh
mise trust
mise install
mise exec -- npm ci
mise exec -- npm run analyze
mise exec -- npm test
mise exec -- npm run check
mise exec -- npm run build
mise exec -- node scripts/check-site.mjs
mise exec -- npm run preview
```

Open `http://127.0.0.1:4173/marketplace-smb/`. The page is static SvelteKit, with Markdown/mdsvex methodology, local fonts, responsive CSS, no analytics, and no backend or secrets. Core findings and the first evidence page are prerendered; filtering and pagination use client JavaScript. CSV and JSON downloads contain all records.

## Update the evidence

Builds never fetch live research. They reproduce results from committed snapshots. Updates are intentional and reviewable:

```sh
# Refresh the immutable Marketplace source snapshot.
mise exec -- npm run fetch
# Query newly encountered providers. Existing research is cached.
mise exec -- npm run research
mise exec -- node scripts/web-research.mjs
mise exec -- node scripts/sec-research.mjs
# Rebuild and inspect changes before publishing.
mise exec -- npm run analyze
mise exec -- npm test
mise exec -- npm run check
mise exec -- npm run build
mise exec -- node scripts/check-site.mjs
git diff --stat
```

To refresh existing SBA/website/SEC observations, use `--refresh` on the relevant script. Git preserves previous committed observations; commit the current snapshot before replacing caches. Do not blindly overwrite curated decisions: inspect `research/review.json` for outdated evidence, ownership, applicable date intervals, and provider IDs after identity merges. A changed alias can change the hashed provider ID. The current-size `asOf` is the Marketplace snapshot date; individual source retrieval and record-update dates remain available and can be older. A source refresh alone does not refresh business-size evidence.

`node scripts/history.mjs` retrieves the seven fixed 2026 reference snapshots used to recover missing identities. Extend its explicit date list when adding more history. `scripts/awards-request.mjs` and `awards-retry.mjs` preserve an exploratory USAspending bulk retrieval attempt; it failed for the full population and is **not part of the classification pipeline**. A one-company diagnostic completed but is not used to infer size.

Edit **`research/review.json`** to add evidence or factors:

- `identityMatches`: provider ID → reviewed UEI and match reason.
- `providerAliases`: exact source name → canonical alias.
- `currentOverrides`: provider ID → classification, confidence, reason, evidence array, and optional conflict flag.
- `historicalOverrides`: provider ID, inclusive start/end dates, and an assessment. Explain why the evidence applies to that interval; never imply greater temporal precision than the source supports.
- `ownershipFlags`: provider, effective date, source, and explanation.
- `companyClaims`: explicit small-business self-descriptions (not statements about customers).
- `excludedProviders`: government operators and exclusion reasons.

Add a new grouping in `scripts/analyze.mjs` for additional analyses. Keep definitions explicit, maintain provider/package denominators, and add a meaningful regression test for changes to calculations. Every non-unknown classification must retain a traceable source and reason. Reports use smallGroup/remainingGroup and their full-denominator percentages. The underlying five evidence tiers are audit metadata, not separate chart groups. Annual provider rows can repeat companies across years; cohortTotals.csv provides deduplicated all-years totals. The website consumes a compact generated extract; full detail remains in `data/analysis.json` and CSV exports.

## Data organization

| Path | Purpose |
| --- | --- |
| `data/source-manifest.json` | Source commit, URLs, retrieval time, hashes |
| `data/sources/<commit>/` | Unmodified Marketplace source files |
| `data/history/`, `history-manifest.json` | Compressed historical exports and provenance |
| `research/sba/` | Sanitized public search attempts, accepted matches, candidates |
| `research/web/` | Website retrieval outcomes and short candidate signals, not automatic classifications |
| `research/sec/`, `sec-mappings.json` | Relevant SEC facts and reviewed entity mappings |
| `research/review.json` | Curated exceptions, identity, temporal and ownership decisions |
| `scripts/normalize.mjs` | Source joins, identity reconciliation, status history |
| `scripts/classify.mjs` | Evidence rules and denominator calculations |
| `scripts/analyze.mjs` | Canonical data, reports, CSVs and site extract |
| `data/schema.json` | Schema for the core analytical records |
| `src/` | Responsive website and Markdown methodology |

## Publication

GitHub Actions validates and deploys the committed snapshot to GitHub Pages on pushes to `main`; pull requests build without deployment. The Pages source is GitHub Actions. No scheduled refresh is enabled. Publishing a reviewed update requires a commit and push; source data is never silently updated by CI.

This repository is separate from the `fedramp-web` prototype lab. It does not modify preserved Marketplace fixtures or the reference site. Government/source content retains its original provenance; website signals are short research excerpts. Do not publish private financial records, API keys, personal contacts, or authenticated exports.

## First deeper review (October 30, 2026; superseded by the checkpoint below)

The reviewed pass is recorded in `research/deep/decisions.json`. It has 131 individual decisions and preserves the pre-review snapshot in `research/deep/baseline.json`. Source discovery and researcher proposals are retained separately; proposals are not automatically accepted. The full ledger gives all 707 providers a disposition and distinguishes individual review from screening. It includes 620 bounded site-discovery attempts and the 50-record stratified audit, with overlap. This is not exhaustive individual research of 707 companies.

Current listed small share changed from 182/662 to 179/662 (27.04%); current unknowns fell from 399 to 352. The 68 changes include confidence changes as well as classifications. Historical assessments, Marketplace snapshot, identities, and denominators are preserved. See [the research report](docs/reports/deep-research.md) and [methodology](https://pete-wai.github.io/marketplace-smb/methodology/).

To revise evidence, add or edit an explicit decision with provider ID/name, classification, confidence, identity confidence, reason, source URLs/dates, relevant NAICS, unresolved questions, and a reviewer note. Apply only reviewed decisions:

```sh
mise exec -- node scripts/apply-deep-decisions.mjs
mise exec -- npm run analyze
mise exec -- npm test
mise exec -- npm run check
mise exec -- npm run build
mise exec -- node scripts/check-site.mjs
```

`analyze` regenerates the ledger CSV/JSON, changes JSON, all reports, and site summary without live fetching. For a new research round, deliberately version the baseline and review date rather than overwriting this comparison. The optional `deep-screen.mjs` and `gsa-research.mjs` use public sources and resumable caches; do not rerun them as part of a build. GSA returned 55 of 124 candidate contract pages; 69 unavailable pages remain visible. Free-source searches cannot establish every private company's receipts or controlling affiliates.

## Second-pass checkpoint (October 30, 2026)

The second pass is **incomplete**: 109 of the initial 352 current unknown providers reviewed, 243 awaiting this pass, and 10 researched but unresolved. One historical-only provider was also reviewed. Of 110 accepted decisions, 20 are likely small, 80 likely not small, and 10 unknown. Current small share is 199/662 (30.06%), up from 179/662 (27.04%); unknowns fell from 352 to 253. These are evidence revisions, not changes in certification or a measured policy effect.

See [second-pass report](docs/reports/second-pass.md), [queue](research/pass2/queue.json), [accepted decisions](research/pass2/decisions.json), and [downloadable progress](static/downloads/research-pass2.json). The cumulative ledger now includes 218 distinct individually reviewed providers. Initial and second-pass baselines, plus superseded decisions, remain preserved. Counts in earlier validation entries describe their respective published versions.

To continue: use the pending rows in the queue; record individual evidence, confidence, relevant business/NAICS context, and unresolved questions. Batch files preserve reviewed inputs. Do not rerun accepted batches; duplicate decisions are rejected. Use the helper only for newly reviewed rows. Preserve each starting snapshot and do not rewrite historical assessments. Report progress every ten decisions, separating current and historical-only counts; elapsed throughput is a batch average, not a per-company search timer.

Promote reviewed pass-two decisions explicitly before analysis:

```sh
mise exec -- node scripts/apply-pass2-decisions.mjs
mise exec -- node scripts/apply-deep-decisions.mjs
mise exec -- npm run analyze
```

Then run the standard tests, Svelte check, production build and static-site validation before publication. An ownership flag can be bypassed only by an explicit ownership-reviewed override; historical ownership flags remain intact. Unknown cases must retain their reason, including conflicting claims, so older self-descriptions cannot silently overwrite the reviewed result.
