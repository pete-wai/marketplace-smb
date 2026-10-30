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
