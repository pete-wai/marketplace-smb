# Initial implementation · 2026-10-30

Standalone implementation from the approved research plan. Reconciles legacy, newer package, and status-event exports; includes seven historical legacy snapshots; records public SBA, website, SEC, and curated evidence. Generates current participation, annual, rolling-window, class, and original-flag reports.

Responsive static site with data downloads, evidence filters, pagination, and Markdown methodology. Repository workflow rebuilds from committed evidence and deploys GitHub Pages.

Completed and unresolved checks are recorded in [validation](docs/validation.md). Generated local summaries are under `output/`; public reports are under `docs/reports/`. Browser visual QA remains unperformed because browser control is disabled. Research limitations are substantive and visible in the site.

## Annual and two-group review · October 30, 2026

User-requested correction: consolidate presentation into the two named exhaustive groups, keep full denominators, reconcile annual/current populations, and re-review certified non-pilot 20x. Shared chart component, deduplicated all-years totals, annual population selector, and targeted source table added. Current non-pilot small group is 4/8; all-ever-certified current-evidence small group is 105/471, versus 16/471 with dated historical evidence. Reasons and uncertainty are retained. See [review corrections](docs/reports/review-corrections.md) and [validation](docs/validation.md). Fifteen tests, Svelte checking, static generation, rendered chart arithmetic, and link checks pass; browser remains disabled.

## Most-recent size basis

Annual cohorts and accompanying rolling-window view now use the most recent size assessment in the snapshot, with an explicit flag that it is not size at certification. Certification year remains first recorded certification. Historical data remains available for audit, without driving the published charts. See validation for completed checks.
